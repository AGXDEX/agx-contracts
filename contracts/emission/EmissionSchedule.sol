// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../libraries/token/IERC20.sol";
import "../libraries/token/SafeERC20.sol";
import "./interfaces/IYieldEmission.sol";
pragma solidity 0.6.12;

contract EmissionSchedule is  OwnableUpgradeable {
    using SafeERC20 for IERC20;


    //week start from 1
    //[0, week 1, week 2 , , , ,]
    uint256[] public scheduledWeekly;
    uint256 public lastUpdateWeek;
    address public yieldEmission;
    IERC20 public rewardToken;

    event WeeklyPctScheduleSet(uint256[] schedule);
    event DistributeWeeklyEmission(uint256 currentWeek,   uint256 amount);


    function initialize( address  _yieldEmission, address _rewardToken) external initializer {
        __Ownable_init_unchained();
        lastUpdateWeek = 0;
        yieldEmission = _yieldEmission;
        rewardToken = IERC20(_rewardToken);
    }


    function getWeeklySchedule() external view returns (uint256[] memory) {
        return scheduledWeekly;
    }


    function setWeeklySchedule(uint256[] memory _scheduleWeekly) external onlyOwner returns (bool) {
        scheduledWeekly = _scheduleWeekly;
        emit WeeklyPctScheduleSet(_scheduleWeekly);
        return true;
    }

    function distributeWeeklyEmission() external returns (uint256 amount) {
        uint256 currentWeek = IYieldEmission(yieldEmission).getWeek();
        uint256 week = lastUpdateWeek;
        require(msg.sender == yieldEmission, "error caller");
        if(week == currentWeek){
            return 0;
        }
        while (week < currentWeek) {
            ++week;
            amount = amount + scheduledWeekly[week];
        }
        lastUpdateWeek = currentWeek;
        rewardToken.safeTransfer(yieldEmission, amount);
        emit DistributeWeeklyEmission( currentWeek, amount);
        return  amount;
    }

}
