// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../libraries/math/SafeMath.sol";
import "../libraries/token/SafeERC20.sol";
import "../libraries/utils/ReentrancyGuard.sol";

import "../staking/interfaces/IRewardDistributor.sol";
import "../access/Governable.sol";

contract WETHEmission is  ReentrancyGuard,  Governable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;


    uint256 public constant PRECISION = 1e30;

    address public distributor;
    mapping (address => bool) public isHandler;
    mapping (address =>  uint256) public  depositBalances;
    uint256 public totalDepositSupply;

    uint256 public totalSupply;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowances;

    uint256 public cumulativeRewardPerToken;
    mapping (address => uint256) public  stakedAmounts;
    mapping (address => uint256) public claimableReward;
    mapping (address => uint256) public previousCumulatedRewardPerToken;
    mapping (address => uint256) public cumulativeRewards;

    event Claim(address receiver, uint256 amount);

    function setDistributor(address _distributor) external onlyGov{
        distributor = _distributor;
    }

    function setHandler(address _handler, bool _isActive) external onlyGov {
        isHandler[_handler] = _isActive;
    }

    function stake(address account, uint256 _amount) external nonReentrant {
        _validateHandler();
        _stake(account,  _amount);
    }

    function unstake(address account, uint256 _amount) external nonReentrant {
        _validateHandler();
        _unstake(account,  _amount);
    }

    function _stake( address _account,  uint256 _amount) private {
        require(_amount > 0, "RewardTracker: invalid _amount");
        _updateRewards(_account);

        stakedAmounts[_account] = stakedAmounts[_account].add(_amount);
        totalSupply = totalSupply.add(_amount);
    }

    function _validateHandler() private view {
        require(isHandler[msg.sender], "RewardTracker: forbidden");
    }

    function _unstake(address _account, uint256 _amount) private {
        require(_amount > 0, "RewardTracker: invalid _amount");

        _updateRewards(_account);

        uint256 stakedAmount = stakedAmounts[_account];
        require(stakedAmounts[_account] >= _amount, "RewardTracker: _amount exceeds stakedAmount");

        stakedAmounts[_account] = stakedAmount.sub(_amount);
        totalSupply = totalSupply.sub(_amount);
    }


    function updateRewards() external nonReentrant {
        _updateRewards(address(0));
    }


    function _updateRewards(address _account) private {
        uint256 blockReward = IRewardDistributor(distributor).distribute();

        uint256 supply = totalSupply;
        uint256 _cumulativeRewardPerToken = cumulativeRewardPerToken;
        if (supply > 0 && blockReward > 0) {
            _cumulativeRewardPerToken = _cumulativeRewardPerToken.add(blockReward.mul(PRECISION).div(supply));
            cumulativeRewardPerToken = _cumulativeRewardPerToken;
        }

        // cumulativeRewardPerToken can only increase
        // so if cumulativeRewardPerToken is zero, it means there are no rewards yet
        if (_cumulativeRewardPerToken == 0) {
            return;
        }

        if (_account != address(0)) {
            uint256 stakedAmount = stakedAmounts[_account];
            uint256 accountReward = stakedAmount.mul(_cumulativeRewardPerToken.sub(previousCumulatedRewardPerToken[_account])).div(PRECISION);
            uint256 _claimableReward = claimableReward[_account].add(accountReward);

            claimableReward[_account] = _claimableReward;
            previousCumulatedRewardPerToken[_account] = _cumulativeRewardPerToken;

            if (_claimableReward > 0 && stakedAmounts[_account] > 0) {
                uint256 nextCumulativeReward = cumulativeRewards[_account].add(accountReward);
                cumulativeRewards[_account] = nextCumulativeReward;
            }
        }
    }

    function claimable(address _account) public  view returns (uint256) {
        uint256 stakedAmount = stakedAmounts[_account];
        if (stakedAmount == 0) {
            return claimableReward[_account];
        }
        uint256 supply = totalSupply;
        uint256 pendingRewards = IRewardDistributor(distributor).pendingRewards().mul(PRECISION);
        uint256 nextCumulativeRewardPerToken = cumulativeRewardPerToken.add(pendingRewards.div(supply));
        return claimableReward[_account].add(
            stakedAmount.mul(nextCumulativeRewardPerToken.sub(previousCumulatedRewardPerToken[_account])).div(PRECISION));
    }

    function rewardToken() public view returns (address) {
        return IRewardDistributor(distributor).rewardToken();
    }


    function claim() external  nonReentrant returns (uint256) {
        return _claim(msg.sender, msg.sender);
    }

    function _claim(address _account, address _receiver) private returns (uint256) {
        _updateRewards(_account);

        uint256 tokenAmount = claimableReward[_account];
        claimableReward[_account] = 0;

        if (tokenAmount > 0) {
            IERC20(rewardToken()).safeTransfer(_receiver, tokenAmount);
            emit Claim(_account, tokenAmount);
        }

        return tokenAmount;
    }




}



