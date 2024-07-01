// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

import "../libraries/token/IERC20.sol";
import "../libraries/token/SafeERC20.sol";
import "./interfaces/IEmissionSchedule.sol";
import "./interfaces/IWETHEmission.sol";

contract StakeAGX is OwnableUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMathUpgradeable for uint256;

    uint256 constant REWARD_DURATION = 1 weeks;
    uint256 public rewardIntegral;
    uint128 public rewardRate;
    uint32 public lastUpdate;
    uint32 public periodFinish;

    IERC20 public agx;
    IERC20 public rewardToken;
    IEmissionSchedule public emissionSchedule;
    uint256 public startTime;
    bool public notified;
    mapping(address => uint256) public rewardIntegralFor;
    mapping(address => uint256) private storedPendingReward;
    uint256 public totalClaim;


    struct StakeInfo {
        uint256 amount;
        uint256 lockupStartTime;
        uint256 multiplier;
        uint256 period;
    }
    uint256 public stakeIDNext;

    mapping(address => mapping(uint256 => StakeInfo)) public  stakeInfos;
    mapping(uint256 => uint256) public lockupRewardMultipliers;
    mapping(address => uint256) public userTotalStakedWithMultiplier;
    uint256 public totalStakedWithMultiplier;
    uint256 public totalStakedWithoutMultiplier;
    mapping(address => uint256) public userTotalStakedWithoutMultiplier;
    IWETHEmission public wethEmission;


    event ClaimReward(address account, address receiver, uint256 amount);
    event FetchReward(uint256 week, uint256 amount);
    event UpdateAccountReward(address account, uint256 rewardIntergralFor);
    event UpdateRewardIntegral(uint256 intergral);
    event Staked(address indexed sender, address receiver, uint256 indexed id, uint256 amount, uint256 period );
    event UnStake(address indexed sender, uint256 indexed id, uint256 amount );
    event AddExcessReward(address indexed sender,  uint256 amount);


    function initialize(address _agx, address _rewardToken, address _wethEmission) external initializer {
        __Ownable_init_unchained();
        agx = IERC20(_agx);
        rewardToken = IERC20(_rewardToken);
        wethEmission = IWETHEmission(_wethEmission);
    }

    function setWETHEmission(address _wethEmission) public onlyOwner{
        wethEmission = IWETHEmission(_wethEmission);
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


    function setLockupRewardMultipliers(uint256[] memory periods, uint256[] memory mutipliers) public onlyOwner{
        for(uint256 i = 0 ; i < periods.length; i++){
            lockupRewardMultipliers[periods[i]] = mutipliers[i];
        }
    }

    function stake(address account, uint256 _amount,  uint256 period) public {
        agx.safeTransferFrom(msg.sender, address (this), _amount);

        _stake(account, _amount, period);
    }

    function _stake(
        address account,
        uint256 _amount,
        uint256 _period
    ) private {
        uint256 id = ++stakeIDNext;
        uint256 multiplier = lockupRewardMultipliers[_period];
        require(multiplier != 0, "invalid lock up period");

        uint256 amountWithMultiplier =  _amount.mul(multiplier);
        wethEmission.stake(account, amountWithMultiplier);
        updateRewards(account);

        stakeInfos[account][id] = StakeInfo({
            amount: _amount,
            lockupStartTime: block.timestamp,
            multiplier: multiplier,
            period: _period
        });

        userTotalStakedWithMultiplier[account] = userTotalStakedWithMultiplier[account].add(amountWithMultiplier);
        userTotalStakedWithoutMultiplier[account] = userTotalStakedWithoutMultiplier[account].add(_amount);
        totalStakedWithMultiplier = totalStakedWithMultiplier.add(amountWithMultiplier);
        totalStakedWithoutMultiplier = totalStakedWithoutMultiplier.add(_amount);
        emit Staked(msg.sender, account,  id, _amount, _period);
    }

    function _unstake(
        uint256 _id
    ) private returns(uint256 amount){
        updateRewards(msg.sender);

        StakeInfo memory stakeInfo = stakeInfos[msg.sender][_id];
        amount = stakeInfo.amount;  
        require(stakeInfo.lockupStartTime > 0, "invalid id");
        require(stakeInfo.lockupStartTime + stakeInfo.period <= block.timestamp, "can not unstake now");
        uint256 amountWithMultiplier =  stakeInfo.amount.mul(stakeInfo.multiplier);
        wethEmission.unstake(msg.sender, amountWithMultiplier);
        userTotalStakedWithMultiplier[msg.sender] = userTotalStakedWithMultiplier[msg.sender].sub(amountWithMultiplier);
        userTotalStakedWithoutMultiplier[msg.sender] = userTotalStakedWithoutMultiplier[msg.sender].sub(amount);
        totalStakedWithMultiplier = totalStakedWithMultiplier.sub(amountWithMultiplier);
        totalStakedWithoutMultiplier = totalStakedWithoutMultiplier.sub(amount);
        delete stakeInfos[msg.sender][_id];
        return amount;
    }


    function unStake(
        uint256 id
    ) external {
        (uint256 totalStakedAmount) = _unstake(id);
        agx.safeTransfer(msg.sender,totalStakedAmount );
        emit UnStake(msg.sender, id, totalStakedAmount);
    }

    function updateRewards(address account) public  {
        uint256 integral = _updateRewardIntegral();
        _updateIntegralForAccount(account,  integral);
    }


    function _updateRewardIntegral() internal returns (uint256 integral) {
        uint256 supply = totalStakedWithMultiplier;
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

    function sendExcessRewards(uint256 excessRewards) public {
        _sendExcessRewards(excessRewards);
        rewardToken.transferFrom(msg.sender, address(this), excessRewards);

    }

    function _sendExcessRewards(uint256 excessRewards) private{
        uint256 integral = _updateRewardIntegral();
        uint256 durationToPeriodFinish = periodFinish - block.timestamp;
        if (excessRewards > 0) {
            uint256 excessRewardRate = excessRewards.div(durationToPeriodFinish);
            rewardRate = uint128(excessRewardRate) + rewardRate;
        }
        emit AddExcessReward(msg.sender, excessRewards);
    }

    function _updateIntegralForAccount(address account,  uint256 currentIntegral) internal {
        uint256 integralFor = rewardIntegralFor[account];
        uint256 balance = userTotalStakedWithMultiplier[account];
        if (currentIntegral > integralFor) {
            storedPendingReward[account] = storedPendingReward[account].add(((balance.mul(currentIntegral.sub(integralFor))).div(1e18)));
            rewardIntegralFor[account] = currentIntegral;
            emit UpdateAccountReward( account, rewardIntegralFor[account]);
        }
    }

    function claim(uint256 period) external returns (uint256) {
        updateRewards(msg.sender);
        uint256 amount = storedPendingReward[msg.sender];
        if (amount > 0) storedPendingReward[msg.sender] = 0;
        uint256 daySeconds = 86400;
        uint256 claimReward;
        if (period == 360 * daySeconds) {
            claimReward = amount;
           // Stake for 360 days and get full rewards
           _stake(msg.sender, amount, period);
        } else if (period == 180 * daySeconds) {
            // Stake for 180 days and get 50% rewards
            uint256 halfReward = amount.div(2);
            claimReward = halfReward;
            _stake(msg.sender, halfReward, period);
            _sendExcessRewards(halfReward);
        } else if (period == 90 * daySeconds) {
            // Stake for 90 days and get 25% rewards
            uint256 quarterReward = amount.div(4);
            claimReward = quarterReward;
            _stake(msg.sender, quarterReward, period);
            _sendExcessRewards(amount.sub(quarterReward));
        } else if (period == 0) {
            // Direct claim and get 10% tokens
            uint256 tenPercentReward = amount.div(10);
            claimReward = tenPercentReward;
            rewardToken.safeTransfer(msg.sender, tenPercentReward);
            _sendExcessRewards(amount.sub(tenPercentReward));
        } else {
            revert("Invalid period");
        }
        totalClaim = totalClaim.add(claimReward);
        emit ClaimReward(msg.sender, msg.sender, claimReward);

       
        return amount;
    }


    function claimable(address _account) external view returns (uint256){
        uint256 amount = storedPendingReward[_account];

        // pending active debt rewards
        uint256 updated = periodFinish;
        if (updated > block.timestamp) updated = block.timestamp;
        uint256 duration = updated.sub(lastUpdate);
        uint256 integral = rewardIntegral;
        if (duration > 0) {
            uint256 supply = totalStakedWithMultiplier;
            if (supply > 0) {
                integral = integral.add((duration.mul(rewardRate).mul(1e18)).div(supply));
            }
        }
        uint256 integralFor = rewardIntegralFor[_account];

        if (integral > integralFor) {
            uint256 balance = userTotalStakedWithMultiplier[_account];
            amount = amount.add((balance.mul(integral.sub(integralFor))).div(1e18));
        }
        return amount;
    }



}
