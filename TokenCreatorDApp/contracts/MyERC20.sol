// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    constructor(
        string memory name,
        string memory symbol,
        uint256 supply,
        address owner
    ) ERC20(name, symbol) {

        require(owner != address(0), "Invalid owner");
        require(supply > 0, "Supply must be greater than zero");

        _mint(owner, supply * 10 ** decimals());
    }
}