// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyERC1155 is ERC1155 {

    // =========================================
    // METADATA
    // =========================================

    mapping(uint256 => string) private tokenURIs;

    mapping(uint256 => uint256) public totalSupply;

    mapping(uint256 => bytes32) private imageHashes;

    mapping(bytes32 => uint256) private imageToToken;

    // =========================================
    // TOKEN LIST
    // =========================================

    uint256[] private allTokenIds;

    mapping(uint256 => bool) private tokenExists;

    // =========================================
    // OWNER => TOKEN IDS
    // =========================================

    mapping(address => uint256[]) private ownerTokens;

    mapping(address => mapping(uint256 => bool))
        private ownerHasToken;

    constructor() ERC1155("") {}

    // =========================================
    // MINT
    // =========================================

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        string memory _uri,
        bytes32 imageHash
    ) public {

        if (!exists(id)) {

            require(
                imageToToken[imageHash] == 0,
                "Image already used"
            );

            tokenURIs[id] = _uri;

            imageHashes[id] = imageHash;

            imageToToken[imageHash] = id + 1;

            tokenExists[id] = true;

            allTokenIds.push(id);

        } else {

            require(
                keccak256(bytes(tokenURIs[id])) ==
                keccak256(bytes(_uri)),
                "Metadata mismatch"
            );

            require(
                imageHashes[id] == imageHash,
                "Wrong image"
            );

        }

        _mint(
            to,
            id,
            amount,
            ""
        );

        totalSupply[id] += amount;

        if (!ownerHasToken[to][id]) {

            ownerHasToken[to][id] = true;

            ownerTokens[to].push(id);

        }

    }

    // =========================================
    // UPDATE OWNER LIST AFTER TRANSFER
    // =========================================

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {

        super._update(
            from,
            to,
            ids,
            values
        );

        for (uint256 i = 0; i < ids.length; i++) {

            uint256 id = ids[i];

            // Receiver

            if (
                to != address(0) &&
                !ownerHasToken[to][id]
            ) {

                ownerHasToken[to][id] = true;

                ownerTokens[to].push(id);

            }

            // Sender

            if (
                from != address(0) &&
                balanceOf(from, id) == 0 &&
                ownerHasToken[from][id]
            ) {

                ownerHasToken[from][id] = false;

                uint256[] storage arr =
                    ownerTokens[from];

                for (
                    uint256 j = 0;
                    j < arr.length;
                    j++
                ) {

                    if (arr[j] == id) {

                        arr[j] =
                            arr[arr.length - 1];

                        arr.pop();

                        break;

                    }

                }

            }

        }

    }

    // =========================================
    // URI
    // =========================================

    function uri(
        uint256 id
    )
        public
        view
        override
        returns(string memory)
    {
        return tokenURIs[id];
    }

    // =========================================
    // EXISTS
    // =========================================

    function exists(
        uint256 id
    )
        public
        view
        returns(bool)
    {
        return tokenExists[id];
    }

    // =========================================
    // TOTAL COPIES
    // =========================================

    function totalCopies(
        uint256 id
    )
        public
        view
        returns(uint256)
    {
        return totalSupply[id];
    }

    // =========================================
    // IMAGE HASH
    // =========================================

    function getImageHash(
        uint256 id
    )
        public
        view
        returns(bytes32)
    {
        return imageHashes[id];
    }

    // =========================================
    // ALL TOKEN IDS
    // =========================================

    function getAllTokenIds()
        public
        view
        returns(uint256[] memory)
    {
        return allTokenIds;
    }

    // =========================================
    // MY TOKENS
    // =========================================

    function getMyTokens()
        public
        view
        returns(uint256[] memory)
    {
        return ownerTokens[msg.sender];
    }

}