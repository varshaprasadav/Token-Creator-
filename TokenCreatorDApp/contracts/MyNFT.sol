// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract MyNFT is ERC721URIStorage {


    // ==========================
    // TOKEN COUNTER
    // ==========================

    uint256 public nextTokenId;


    // ==========================
    // COLLECTION DETAILS
    // ==========================

    string public collectionName;

    string public collectionSymbol;



    // ==========================
    // IMAGE DUPLICATE CHECK
    // ==========================

    mapping(bytes32 => bool) public usedImages;



    // ==========================
    // OWNER NFT TRACKING
    // ==========================

    mapping(address => uint256[]) private ownerNFTs;



    // ==========================
    // TOKEN IMAGE HASH
    // ==========================

    mapping(uint256 => bytes32) private imageHashes;



    // ==========================
    // EVENT
    // ==========================

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string tokenURI
    );



    // ==========================
    // CONSTRUCTOR
    // ==========================

    constructor(
        string memory _name,
        string memory _symbol
    )
    ERC721(
        _name,
        _symbol
    )
    {

        collectionName = _name;

        collectionSymbol = _symbol;

    }



    // ==========================
    // MINT NFT
    // ==========================

    function mint(
        address to,
        string memory uri,
        bytes32 imageHash
    )
    public
    returns(uint256)
    {


        require(
            !usedImages[imageHash],
            "Image already minted"
        );



        uint256 tokenId =
            nextTokenId;



        nextTokenId++;



        _safeMint(
            to,
            tokenId
        );



        _setTokenURI(
            tokenId,
            uri
        );



        // Mark image as used

        usedImages[imageHash] = true;



        // Store image hash

        imageHashes[tokenId] = imageHash;



        emit NFTMinted(
            tokenId,
            to,
            uri
        );



        return tokenId;

    }





    // ==========================
    // TOTAL MINTED
    // ==========================

    function totalMinted()
    public
    view
    returns(uint256)
    {

        return nextTokenId;

    }





    // ==========================
    // CHECK IMAGE EXISTS
    // ==========================

    function imageExists(
        bytes32 hash
    )
    public
    view
    returns(bool)
    {

        return usedImages[hash];

    }





    // ==========================
    // GET OWNER NFT IDS
    // ==========================

    function getNFTsByOwner(
        address owner
    )
    public
    view
    returns(uint256[] memory)
    {

        return ownerNFTs[owner];

    }





    // ==========================
    // GET IMAGE HASH
    // ==========================

    function getImageHash(
        uint256 tokenId
    )
    public
    view
    returns(bytes32)
    {

        return imageHashes[tokenId];

    }





    // ==========================
    // UPDATE OWNER AFTER TRANSFER
    // OPENZEPPELIN v5
    // ==========================

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
    internal
    override
    returns(address)
    {


        address from =
            super._update(
                to,
                tokenId,
                auth
            );



        // Remove from old owner

        if(from != address(0))
        {


            uint256[] storage list =
                ownerNFTs[from];



            for(
                uint256 i = 0;
                i < list.length;
                i++
            )
            {

                if(
                    list[i] == tokenId
                )
                {


                    list[i] =
                    list[list.length - 1];



                    list.pop();



                    break;

                }

            }

        }



        // Add to new owner

        if(to != address(0))
        {

            ownerNFTs[to].push(tokenId);

        }



        return from;

    }

}