pragma solidity >=0.6.2 <0.9.0;
pragma experimental ABIEncoderV2;
import "forge-std/Test.sol";
import "../contracts/gmx/ALP.sol";
import "../contracts/gmx/AGX.sol";
import "../contracts/emission/EmissionSchedule.sol";
import "../contracts/emission/YieldEmission.sol";

contract EmissionTest is Test {
    ALP public alp;
    AGX public agx;
    YieldEmission public yieldEmission;
    EmissionSchedule public emissionSchedule;
    address public owner = 0x647EA6FB992Ffefd9c8aC686f94B9dDE06c943a6;
    address public user1 = 0x836f5473B40F6E9581ae18D4821Ec1892dEE5ccC;
    address public user2 = 0x911fCeE8553E9a5d6439CD4F1ae47Aa9A597Ec2a;
    function setUp() public{
        vm.startPrank(owner);
        vm.warp(1000);
        alp = new ALP();
        agx = new AGX();

        agx.setMinter(owner, true);
        agx.mint(owner, 100000 ether);

        yieldEmission = new YieldEmission();
        yieldEmission.initialize(address (alp), address (agx));

        emissionSchedule = new EmissionSchedule();
        emissionSchedule.initialize(address (yieldEmission), address (agx));

        yieldEmission.setEmissionSchedule(address (emissionSchedule));

        address[] memory yieldTrackers = new address[](1);
        yieldTrackers[0] = address (yieldEmission);

        alp.setYieldTrackers(yieldTrackers);

        //TODO delete
        alp.setMinter(owner, true);

        uint256[] memory weeklySchedule = new uint256[](5);
        weeklySchedule[0] = 0;
        weeklySchedule[1] = 2000 ether;
        weeklySchedule[2] = 1000 ether;
        weeklySchedule[3] = 500 ether;
        weeklySchedule[4] = 200 ether;

        agx.transfer(address (emissionSchedule), 3700 ether);
        emissionSchedule.setWeeklySchedule(weeklySchedule);



    }


    function testEmission() public{
        vm.warp(2000);
        assertEq(agx.balanceOf(address (emissionSchedule)), 3700 ether);
        yieldEmission.notify();

        assertEq(agx.balanceOf(address (emissionSchedule)), 1700 ether);
        assertEq(agx.balanceOf(address (yieldEmission)), 2000 ether);
        console.log(yieldEmission.rewardRate());

        alp.mint(user1, 100 ether);
        alp.mint(user2, 100 ether);
        vm.warp(2000 + 0.5 weeks);
        vm.startPrank(user1);
        alp.claim(user1);
        vm.warp(2000 + 0.7 weeks);
        alp.claim(user1);
        vm.startPrank(user2);
        alp.claim(user2);

        vm.startPrank(owner);
        uint256[] memory weeklySchedule = new uint256[](5);
        weeklySchedule[0] = 0;
        weeklySchedule[1] = 2000 ether;
        weeklySchedule[2] = 0 ether;
        weeklySchedule[3] = 300 ether;
        weeklySchedule[4] = 200 ether;
        emissionSchedule.setWeeklySchedule(weeklySchedule);

        vm.warp(2000 + 1 weeks);
        console.log(yieldEmission.rewardRate());
        alp.mint(user1, 1000 ether);
        console.log(yieldEmission.rewardRate());












    }
}
