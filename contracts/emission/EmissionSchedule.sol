// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../libraries/token/IERC20.sol";
import "../libraries/token/SafeERC20.sol";
pragma solidity 0.6.12;

contract EmissionSchedule is  OwnableUpgradeable {
    event WeeklyPctScheduleSet(uint64[] schedule);
    event LockParametersSet(uint256 lockWeeks, uint256 lockDecayWeeks);

    //week start from 1
    //[0, week 1, week 2]
    uint256[] private scheduledWeekly;
    uint256 public lastUpdateWeek;
    address public yieldEmission;
    IERC20 public rewardToken;


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
        return true;
    }

    function distributeWeeklyEmission(
        uint256 week
    ) external returns (uint256 amount) {
        require(msg.sender == yieldEmission, "error caller");
        if(week <= lastUpdateWeek){
            return 0;
        }
        lastUpdateWeek = week ;
        rewardToken.transfer(yieldEmission, scheduledWeekly[week]);
        return  scheduledWeekly[week];
    }

}
