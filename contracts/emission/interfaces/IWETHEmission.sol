// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface IWETHEmission {
    function stake(address account, uint256 _amount) external ;
    function unstake(address account, uint256 _amount) external ;

}
