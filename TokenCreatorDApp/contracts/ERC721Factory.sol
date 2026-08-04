// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyNFT.sol";

contract ERC721Factory {

    // =====================================
    // EVENTS
    // =====================================

    event NFTCreated(
        address indexed nftAddress,
        address indexed owner,
        string name,
        string symbol
    );

    // =====================================
    // STORAGE
    // =====================================

    address[] public collections;

    // =====================================
    // CREATE NEW NFT COLLECTION
    // =====================================

    function createNFT(
        string memory name,
        string memory symbol
    )
        public
        returns (address)
    {
        MyNFT nft = new MyNFT(
            name,
            symbol
        );

        collections.push(
            address(nft)
        );

        emit NFTCreated(
            address(nft),
            msg.sender,
            name,
            symbol
        );

        return address(nft);
    }

    // =====================================
    // TOTAL COLLECTIONS
    // =====================================

    function totalCollections()
        public
        view
        returns (uint256)
    {
        return collections.length;
    }

    // =====================================
    // GET ALL COLLECTIONS
    // =====================================

    function getCollections()
        public
        view
        returns (address[] memory)
    {
        return collections;
    }
}