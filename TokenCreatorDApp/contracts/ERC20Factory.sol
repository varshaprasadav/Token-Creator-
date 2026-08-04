// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyERC20.sol";

contract ERC20Factory {

    struct TokenInfo {
        address tokenAddress;
        address owner;
        string name;
        string symbol;
        uint256 totalSupply;
    }

    event TokenCreated(
        address indexed tokenAddress,
        address indexed owner,
        string name,
        string symbol,
        uint256 totalSupply
    );

    // All created token details
    TokenInfo[] private allTokenDetails;

    // Token addresses created by each user
    mapping(address => address[]) public userTokens;

    // Token details created by each user
    mapping(address => TokenInfo[]) private userTokenDetails;

    // ==========================
    // CREATE TOKEN
    // ==========================

    function createToken(
        string memory name,
        string memory symbol,
        uint256 supply
    ) external returns (address) {

        require(bytes(name).length > 0, "Token name required");
        require(bytes(symbol).length > 0, "Token symbol required");
        require(supply > 0, "Supply must be greater than zero");

        MyERC20 token = new MyERC20(
            name,
            symbol,
            supply,
            msg.sender
        );

        address tokenAddress = address(token);

        TokenInfo memory info = TokenInfo({
            tokenAddress: tokenAddress,
            owner: msg.sender,
            name: name,
            symbol: symbol,
            totalSupply: supply
        });

        allTokenDetails.push(info);

        userTokens[msg.sender].push(tokenAddress);

        userTokenDetails[msg.sender].push(info);

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            supply
        );

        return tokenAddress;
    }

    // ==========================
    // ALL TOKEN DETAILS
    // ==========================

    function getAllTokenDetails()
        external
        view
        returns (TokenInfo[] memory)
    {
        return allTokenDetails;
    }

    // ==========================
    // ALL TOKEN ADDRESSES
    // ==========================

    function getAllTokens()
        external
        view
        returns (address[] memory)
    {
        address[] memory tokens = new address[](allTokenDetails.length);

        for (uint256 i = 0; i < allTokenDetails.length; i++) {
            tokens[i] = allTokenDetails[i].tokenAddress;
        }

        return tokens;
    }

    // ==========================
    // MY TOKEN ADDRESSES
    // ==========================

    function getMyTokens()
        external
        view
        returns (address[] memory)
    {
        return userTokens[msg.sender];
    }

    // ==========================
    // MY TOKEN DETAILS
    // ==========================

    function getMyTokenDetails()
        external
        view
        returns (TokenInfo[] memory)
    {
        return userTokenDetails[msg.sender];
    }
}