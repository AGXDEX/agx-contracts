// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
interface IStakeAGX {
    function stake(address account, uint256 amount, uint256 period) external;
    function sendExcessRewards(uint256 excessRewards) external;
}
