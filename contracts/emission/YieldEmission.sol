// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";
import "../tokens/interfaces/IYieldTracker.sol";

import "../tokens/interfaces/IYieldToken.sol";
import "../libraries/token/IERC20.sol";
import "../libraries/token/SafeERC20.sol";
import "./interfaces/IEmissionSchedule.sol";

contract YieldEmission is IYieldTracker, OwnableUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMathUpgradeable for uint256;

    uint256 constant REWARD_DURATION = 1 weeks;
    uint256 public rewardIntegral;
    uint128 public rewardRate;
    uint32 public lastUpdate;
    uint32 public periodFinish;

    IYieldToken public yieldToken;
    IERC20 public rewardToken;
    IEmissionSchedule public emissionSchedule;

    uint256 public startTime;
    bool public notified;
    mapping(address => uint256) public rewardIntegralFor;
    mapping(address => uint256) private storedPendingReward;
    uint256 public totalClaim;
    event ClaimReward(address account, address receiver, uint256 amount);
    event FetchReward(uint256 week, uint256 amount);
    event UpdateAccountReward(address account, uint256 rewardIntergralFor);
    event UpdateRewardIntegral(uint256 intergral);



    function initialize(address _yieldToken, address _rewardToken) external initializer {
        __Ownable_init_unchained();
        yieldToken = IYieldToken(_yieldToken);
        rewardToken = IERC20(_rewardToken);
    }

    function notify() public onlyOwner{
        require(!notified, "already notified");
        notified = true;
        startTime = block.timestamp;
        uint256 amount = emissionSchedule.distributeWeeklyEmission();
        rewardRate = uint128(amount.div(REWARD_DURATION));
        lastUpdate = uint32(block.timestamp);
        periodFinish = uint32(block.timestamp.add(REWARD_DURATION));
        emit FetchReward(1, amount);
    }


    function setEmissionSchedule(address _emissionSchedule)  public onlyOwner{
        emissionSchedule = IEmissionSchedule(_emissionSchedule);
    }

    function getWeek() public view returns (uint256 week) {
        return ((block.timestamp.sub(startTime)).div(1 weeks)).add(1);
    }

    function updateRewards(address account) public  override {
        uint256 integral = _updateRewardIntegral();
        _updateIntegralForAccount(account,  integral);
    }


    function _updateRewardIntegral() internal returns (uint256 integral) {
        uint256 supply = yieldToken.totalStaked();
        uint256 _periodFinish = periodFinish;
        uint256 updated = _periodFinish;
        if (updated > block.timestamp) updated = block.timestamp;
        uint256 duration = updated - lastUpdate;
        integral = rewardIntegral;
        if (duration > 0) {
            lastUpdate = uint32(updated);
            if (supply > 0) {
                integral = integral.add((duration.mul(rewardRate).mul(1e18)).div(supply));
                rewardIntegral = integral;
            }
        }
        emit UpdateRewardIntegral(rewardIntegral);
        _fetchRewards(_periodFinish);
        return integral;
    }

    function _fetchRewards(uint256 _periodFinish) internal {
        uint256 currentWeek = getWeek();
        if (currentWeek < ((_periodFinish.sub(startTime)).div(1 weeks)).add(1)) return;

        uint256 amount = emissionSchedule.distributeWeeklyEmission();
        if (block.timestamp < _periodFinish) {
            uint256 remaining = _periodFinish.sub(block.timestamp);
            amount = amount.add(remaining.mul(rewardRate));
        }
        rewardRate = uint128(amount.div(REWARD_DURATION));
        lastUpdate = uint32(block.timestamp);
        periodFinish = uint32(block.timestamp.add(REWARD_DURATION));
        emit FetchReward(currentWeek, amount);
    }


    function _updateIntegralForAccount(address account,  uint256 currentIntegral) internal {
        uint256 integralFor = rewardIntegralFor[account];
        uint256 balance = yieldToken.stakedBalance(account);
        if (currentIntegral > integralFor) {
            storedPendingReward[account] = storedPendingReward[account].add(((balance.mul(currentIntegral.sub(integralFor))).div(1e18)));
            rewardIntegralFor[account] = currentIntegral;
            emit UpdateAccountReward( account, rewardIntegralFor[account]);
        }

    }

    function claim(address _account, address _receiver) external override returns (uint256) {
        require(msg.sender == address (yieldToken), "YieldTracker: forbidden");
        updateRewards(_account);
        uint256 amount = storedPendingReward[_account];
        if (amount > 0) storedPendingReward[_account] = 0;
        totalClaim = totalClaim.add(amount);
        rewardToken.safeTransfer(_receiver, amount);
        emit ClaimReward(_account, _receiver, amount);
        return amount;
    }

    function getTokensPerInterval() external override view returns (uint256){
        return 0;
    }

    function claimable(address _account) external view override returns (uint256){
        uint256 amount = storedPendingReward[_account];

        // pending active debt rewards
        uint256 updated = periodFinish;
        if (updated > block.timestamp) updated = block.timestamp;
        uint256 duration = updated.sub(lastUpdate);
        uint256 integral = rewardIntegral;
        if (duration > 0) {
            uint256 supply = yieldToken.totalStaked();
            if (supply > 0) {
                integral = integral.add((duration.mul(rewardRate).mul(1e18)).div(supply));
            }
        }
        uint256 integralFor = rewardIntegralFor[_account];

        if (integral > integralFor) {
            uint256 balance = yieldToken.stakedBalance(_account);
            amount = amount.add((balance.mul(integral.sub(integralFor))).div(1e18));
        }
        return amount;
    }



}
