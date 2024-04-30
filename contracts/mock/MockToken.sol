// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20{
    uint8 public decimal;
    constructor(string memory name, string memory symbol, uint8 _decimal) ERC20(name, symbol)  {
        decimal = _decimal;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }


    function decimals() public view override returns (uint8) {
        return decimal;
    }
}
