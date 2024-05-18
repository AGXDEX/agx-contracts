// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

interface IEmissionSchedule {
    function distributeWeeklyEmission(
        uint256 week
    ) external returns (uint256 amount);
}
