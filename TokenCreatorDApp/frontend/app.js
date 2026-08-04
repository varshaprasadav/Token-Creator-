// ==========================
// CONTRACT ADDRESSES
// ==========================

const ERC20_FACTORY =
"0xE3BfdD7Fe375e45d106aCD5B35d33f12ea6565bF";
const ERC721_ADDRESS = "0xe7EF6174717A02D781878F1dd81ae4FAeD066FD8";


const ERC1155_ADDRESS =
"0xe9700C2aB88762349b4E9768533fec5fa7ae325D";

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxODY0MjhmNC0wMWFmLTQ5Y2YtYjAwZS0wYTI5Njc1YjY0YjEiLCJlbWFpbCI6InZhcnNoYXByYXNhZDIwMTlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZjMzU3ZTM1ZThlMjFkMzBhYjMzIiwic2NvcGVkS2V5U2VjcmV0IjoiNGZlNjQ0MzU0NjhlM2M0ZTdiZWU4MDMyZmFmNzlkMzkyN2M3OWNiNjRlZTRmM2Q1ZWI5NjY5OTFjZjFkZGEzZCIsImV4cCI6MTgxMjc4NTEwMX0.N1O4AlfJS8cf0lnGTjgt1PY60JvB6ivCvWjQ-rj1Lw0";



// ==========================
// ABIs
// ==========================


// ERC20 Factory ABI
const ERC20_ABI = [

    "event TokenCreated(address indexed tokenAddress,address indexed owner,string name,string symbol,uint256 totalSupply)",

    "function createToken(string,string,uint256) returns(address)",

    "function getAllTokens() view returns(address[])",

    "function getMyTokens() view returns(address[])",

    "function getMyTokenDetails() view returns((address tokenAddress,string name,string symbol,uint256 totalSupply)[])"

];
// Individual ERC20 Token ABI

const ERC20_TOKEN_ABI = [

    "function transfer(address,uint256) returns(bool)",

    "function balanceOf(address) view returns(uint256)",

    "function decimals() view returns(uint8)",

    "function symbol() view returns(string)",

    "function name() view returns(string)",

    "function totalSupply() view returns(uint256)"

];

// ERC721 ABI
const ERC721_ABI = [

    "event NFTMinted(uint256 indexed tokenId,address indexed owner,string tokenURI)",
    "event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)",
    "function mint(address to,string tokenURI,bytes32 imageHash) returns(uint256)",
     "function ownerOf(uint256 tokenId) view returns(address)",
    "function tokenURI(uint256 tokenId) view returns(string)",
    "function name() view returns(string)",
    "function symbol() view returns(string)",


    "function transferFrom(address from,address to,uint256 tokenId)",
    
    "function safeTransferFrom(address from,address to,uint256 tokenId)",

    "function approve(address to,uint256 tokenId)",

    "function getApproved(uint256 tokenId) view returns(address)",

    "function setApprovalForAll(address operator,bool approved)",

    "function isApprovedForAll(address owner,address operator) view returns(bool)",


    // Custom
    "function nextTokenId() view returns(uint256)",
    "function totalMinted() view returns(uint256)",
    "function imageExists(bytes32 imageHash) view returns(bool)",
    "function getNFTsByOwner(address owner) view returns(uint256[])"
];

// ERC1155 ABI
const ERC1155_ABI = [

    "event TransferSingle(address indexed operator,address indexed from,address indexed to,uint256 id,uint256 value)",

    "function mint(address to,uint256 id,uint256 amount,string tokenURI,bytes32 imageHash)",

    "function exists(uint256 id) view returns(bool)",

    "function uri(uint256 id) view returns(string)",

    "function balanceOf(address account,uint256 id) view returns(uint256)",

    "function totalCopies(uint256 id) view returns(uint256)",

    "function getImageHash(uint256 id) view returns(bytes32)",

    "function getMyTokens() view returns(uint256[])",

    "function getAllTokenIds() view returns(uint256[])",

"function safeTransferFrom(address from,address to,uint256 id,uint256 amount,bytes data)"
];

// ==========================
// GLOBALS
// ==========================

let signer;

const uploadedImages = new Set();


// ==========================
// LOCAL STORAGE
// ==========================

const ERC721_STORAGE_KEY=
    `erc721Gallery_${ERC721_ADDRESS}`;

let nftGallery =
    JSON.parse(
        localStorage.getItem(ERC721_STORAGE_KEY)
    ) || [];


const ERC1155_STORAGE_KEY =
    `erc1155Gallery_${ERC1155_ADDRESS}`;

let erc1155Gallery =
    JSON.parse(
        localStorage.getItem(ERC1155_STORAGE_KEY)
    ) || [];


// ==========================
// CONNECT WALLET
// ==========================

async function connectWallet() {

    try {

        if (!window.ethereum) {
            alert("Please install MetaMask.");
            return;
        }

        const provider =
            new ethers.BrowserProvider(window.ethereum);

        // MetaMask only shows the "choose an account" popup the FIRST
        // time a site requests access. After that, eth_requestAccounts
        // just silently returns the same account, with no way to pick
        // a different one from this button. wallet_requestPermissions
        // forces MetaMask to re-show the account picker every time.
        try {

            await window.ethereum.request({
                method: "wallet_requestPermissions",
                params: [{ eth_accounts: {} }]
            });

        } catch (permErr) {

            if (permErr && permErr.code === 4001) {

                // User explicitly closed/cancelled the account picker -
                // respect that instead of silently reconnecting them.
                alert("Connection Request Cancelled");
                return;

            }

            // Some wallets / older MetaMask versions don't support
            // wallet_requestPermissions - fall back to the normal flow.
            console.warn(
                "wallet_requestPermissions not supported, falling back:",
                permErr
            );

        }

        await provider.send(
            "eth_requestAccounts",
            []
        );

        signer =
            await provider.getSigner();

        const address =
            await signer.getAddress();

        document.getElementById("walletAddress").innerText =
            "Connected : " + address;

        // Load galleries after wallet connection
        await loadGallery();
        await load1155Gallery();

        alert("Wallet Connected Successfully!");

    } catch (err) {

        console.error(err);

        alert("Wallet Connection Failed");

    }

}


// ==========================
// HANDLE ACCOUNT / NETWORK SWITCHES
// ==========================
// MetaMask lets the user hold several accounts, but it never tells your
// app when the user switches between them unless you listen for it.
// Without this, `signer` keeps pointing at whichever account connected
// first, so switching accounts in MetaMask silently does nothing here.

async function handleAccountsChanged(accounts) {

    if (!accounts || accounts.length === 0) {

        // User disconnected / locked MetaMask
        signer = undefined;

        document.getElementById("walletAddress").innerText =
            "Not Connected";

        return;

    }

    try {

        const provider =
            new ethers.BrowserProvider(window.ethereum);

        signer =
            await provider.getSigner();

        const address =
            await signer.getAddress();

        document.getElementById("walletAddress").innerText =
            "Connected : " + address;

        // Refresh galleries for the newly active account
        await loadGallery();
        await load1155Gallery();

    } catch (err) {

        console.error(err);

    }

}

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        handleAccountsChanged
    );

    // Safest way to handle a network switch is a full reload,
    // since contract addresses may only be valid on one chain.
    window.ethereum.on(
        "chainChanged",
        () => window.location.reload()
    );

}


// ==========================
// TAB SWITCH
// ==========================

function showTab(tab) {

    document.getElementById("erc20Section").classList.add("hidden");
    document.getElementById("erc721Section").classList.add("hidden");
    document.getElementById("erc1155Section").classList.add("hidden");

    if (tab === "erc20") {

        document.getElementById("erc20Section").classList.remove("hidden");

    }

    if (tab === "erc721") {

        document.getElementById("erc721Section").classList.remove("hidden");

    }

    if (tab === "erc1155") {

        document.getElementById("erc1155Section").classList.remove("hidden");

    }

}


// ==========================
// ERC721 IMAGE PREVIEW
// ==========================

function preview721(event) {

    const file = event.target.files[0];

    if (!file) return;

    const img =
        document.getElementById("preview721");

    img.src =
        URL.createObjectURL(file);

    img.classList.remove("hidden");

}


// ==========================
// ERC1155 IMAGE PREVIEW
// ==========================

function preview1155(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    const img =
        document.getElementById("preview1155");

    img.src =
        URL.createObjectURL(file);

    img.classList.remove("hidden");

}


// ==========================
// PINATA IMAGE UPLOAD
// ==========================

async function uploadImage(file) {

    try {

        const form = new FormData();

        form.append("file", file);

        const response = await fetch(

            "https://api.pinata.cloud/pinning/pinFileToIPFS",

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${PINATA_JWT}`

                },

                body: form

            }

        );

        const data = await response.json();

        if (!data.IpfsHash) {

            throw new Error("Image upload failed.");

        }

        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    }

    catch (err) {

        console.error(err);

        throw err;

    }

}


// ==========================
// PINATA METADATA UPLOAD
// ==========================

async function uploadMetadata(name, imageURL) {

    try {

        const metadata = {

            name,

            description: "NFT created using Token Creator DApp",

            image: imageURL

        };

        const response = await fetch(

            "https://api.pinata.cloud/pinning/pinJSONToIPFS",

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${PINATA_JWT}`,

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(metadata)

            }

        );

        const data = await response.json();

        if (!data.IpfsHash) {

            throw new Error("Metadata upload failed.");

        }

        return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;

    }

    catch (err) {

        console.error(err);

        throw err;

    }

}


// ==========================
// HOODI EXPLORER HELPERS
// ==========================

function getTransactionLink(txHash) {

    return `https://hoodi.etherscan.io/tx/${txHash}`;

}

function getAddressLink(address) {

    return `https://hoodi.etherscan.io/address/${address}`;

}



// ==========================================================================================================================================
// CREATE ERC20
// ==========================================================================================================================================

async function createERC20() {

    try {

        if (!signer) {
            alert("Connect Wallet First");
            return;
        }

        const status =
            document.getElementById("status");

        status.innerText = "";

        const name =
            document.getElementById("erc20Name").value.trim();

        const symbol =
            document.getElementById("erc20Symbol").value.trim();

        const supply =
            document.getElementById("erc20Supply").value.trim();

        if (!name) {
            alert("Enter Token Name");
            return;
        }

        if (!symbol) {
            alert("Enter Token Symbol");
            return;
        }

        if (!supply || Number(supply) <= 0) {
            alert("Enter Valid Supply");
            return;
        }

        const button =
            document.getElementById("erc20Btn");

        button.disabled = true;
        button.innerText = "Creating...";

        const contract =
            new ethers.Contract(
                ERC20_FACTORY,
                ERC20_ABI,
                signer
            );

        const tx =
            await contract.createToken(
                name,
                symbol,
                supply
            );

        status.innerText =
            "Waiting for transaction confirmation...";

        const receipt =
            await tx.wait();

        let tokenAddress = "";

        for (const log of receipt.logs) {

            try {

                const parsed =
                    contract.interface.parseLog(log);

                if (
                    parsed &&
                    parsed.name === "TokenCreated"
                ) {

                    tokenAddress =
                        parsed.args.tokenAddress;

                    break;

                }

            } catch {}

        }

        document
            .getElementById("erc20Card")
            .classList.remove("hidden");

        document
            .getElementById("tokenName")
            .innerText = name;

        document
            .getElementById("tokenSymbol")
            .innerText = symbol;

        document
            .getElementById("tokenSupply")
            .innerText = supply;

        document
            .getElementById("tokenContract")
            .innerText = tokenAddress;

        document
            .getElementById("tokenOwner")
            .innerText =
            await signer.getAddress();

        document
            .getElementById("tokenTx")
            .innerText = tx.hash;

        // Auto-fill transfer contract address
        const transferBox =
            document.getElementById("transferToken");

        if (transferBox) {

            transferBox.value =
                tokenAddress;

        }

        status.innerText =
            "ERC20 Token Created Successfully";

        if (
            !document
                .getElementById("erc20List")
                .classList.contains("hidden")
        ) {

            await loadERC20Tokens();

        }

        button.disabled = false;
        button.innerText = "Create ERC20";

        if (tokenAddress !== "") {

            await window.ethereum.request({

                method: "wallet_watchAsset",

                params: {

                    type: "ERC20",

                    options: {

                        address: tokenAddress,

                        symbol: symbol,

                        decimals: 18

                    }

                }

            });

        }

    }

    catch (err) {

        console.error(err);

        document
            .getElementById("status")
            .innerText =
            err.reason ||
            err.message ||
            "ERC20 Creation Failed";

        const button =
            document.getElementById("erc20Btn");

        button.disabled = false;
        button.innerText = "Create ERC20";

    }

}


// ==========================
// TOGGLE ERC20 TOKEN LIST
// ==========================

async function toggleERC20List() {

    const list =
        document.getElementById("erc20List");

    if (list.classList.contains("hidden")) {

        list.classList.remove("hidden");

        await loadERC20Tokens();

    }

    else {

        list.classList.add("hidden");

    }

}

// ==========================
// LOAD MY ERC20 TOKENS
// ==========================

async function loadERC20Tokens() {

    const container =
        document.getElementById("erc20ListContainer");

    container.innerHTML = "";

    if (!signer) {

        container.innerHTML = `

        <div class="border rounded-lg p-4 bg-white">

            Connect Wallet First

        </div>

        `;

        return;

    }

    const factory =
        new ethers.Contract(
            ERC20_FACTORY,
            ERC20_ABI,
            signer
        );

    const tokenAddresses =
        await factory.getAllTokens();

    const wallet =
        await signer.getAddress();

    let found = false;

    for (const tokenAddress of tokenAddresses) {

        const token =
            new ethers.Contract(
                tokenAddress,
                ERC20_TOKEN_ABI,
                signer
            );

        const balance =
            await token.balanceOf(wallet);

        if (balance === 0n) {
            continue;
        }

        found = true;

        const name =
            await token.name();

        const symbol =
            await token.symbol();

        const decimals =
            await token.decimals();

        const totalSupply =
            await token.totalSupply();

        container.innerHTML += `

        <div class="border rounded-xl p-5 bg-white shadow">

            <h3 class="text-xl font-bold text-green-600">

                ${name}

            </h3>

            <p><b>Symbol :</b> ${symbol}</p>

            <p><b>My Balance :</b>
                ${ethers.formatUnits(balance, decimals)}
            </p>

            <p><b>Total Supply :</b>
                ${ethers.formatUnits(totalSupply, decimals)}
            </p>

            <p class="break-all">

                <b>Contract :</b><br>

                ${tokenAddress}

            </p>

        </div>

        `;

    }

    if (!found) {

        container.innerHTML = `

        <div class="border rounded-lg p-4 bg-white">

            No ERC20 Tokens Found

        </div>

        `;

    }

}


// ==========================
// TRANSFER ERC20
// ==========================

async function transferERC20() {

    try {

        if (!signer) {
            alert("Connect Wallet First");
            return;
        }

        const tokenAddress =
            document.getElementById("transferToken").value.trim();

        const to =
            document.getElementById("transferTo").value.trim();

        const amount =
            document.getElementById("transferAmount").value.trim();

        if (!tokenAddress) {
            alert("Enter ERC20 Contract Address");
            return;
        }

        if (!to) {
            alert("Enter Recipient Address");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            alert("Enter Valid Amount");
            return;
        }

        const contract =
            new ethers.Contract(
                tokenAddress,
                ERC20_TOKEN_ABI,
                signer
            );

        const decimals =
            await contract.decimals();

        const symbol =
            await contract.symbol();

        const parsedAmount =
            ethers.parseUnits(amount, decimals);

        const result =
            document.getElementById("transferResult");

        if (result) {

            result.classList.remove("hidden");

            result.innerText =
                "Waiting for transaction confirmation...";

        }

        const tx =
            await contract.transfer(
                to,
                parsedAmount
            );

        await tx.wait();

        // Refresh ERC20 list (updates sender balance)

        if (
            !document
                .getElementById("erc20List")
                .classList.contains("hidden")
        ) {

            await loadERC20Tokens();

        }

        // ==========================
        // SUCCESS CARD
        // ==========================

        document
            .getElementById("transferAmountResult")
            .innerText =
            amount + " " + symbol;

        document
            .getElementById("transferToResult")
            .innerText =
            to;

        document
            .getElementById("transferTxResult")
            .innerText =
            tx.hash;

        document
            .getElementById("transferExplorerLink")
            .href =
            `https://hoodi.etherscan.io/tx/${tx.hash}`;

        document
            .getElementById("transferSuccessCard")
            .classList.remove("hidden");

        if (result) {

            result.classList.add("hidden");

        }

        document.getElementById("transferTo").value = "";

        document.getElementById("transferAmount").value = "";

    }

    catch (err) {

        console.error(err);

        alert(
            err.reason ||
            err.message ||
            "Transfer Failed"
        );

        const result =
            document.getElementById("transferResult");

        if (result) {

            result.classList.add("hidden");

        }

    }

}

// ====================================================================================================================================
// CREATE ERC721
// =====================================================================================================================================

async function createERC721() {

    try {

        if (!signer) {
            alert("Connect Wallet First");
            return;
        }

        const collectionName =
            document.getElementById("erc721Name").value.trim();

        const collectionSymbol =
            document.getElementById("erc721Symbol").value.trim();

        const file =
            document.getElementById("erc721Image").files[0];

        if (!collectionName || !collectionSymbol || !file) {

            alert("Fill all fields");
            return;

        }

        const contract =
            new ethers.Contract(
                ERC721_ADDRESS,
                ERC721_ABI,
                signer
            );

        // ==========================
        // IMAGE HASH
        // ==========================

        const buffer =
            await file.arrayBuffer();

        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                buffer
            );

        const imageHash =
            "0x" +
            Array.from(new Uint8Array(hashBuffer))
            .map(
                x => x.toString(16).padStart(2, "0")
            )
            .join("");

        const exists =
            await contract.imageExists(imageHash);

        if (exists) {

            alert("Image already minted");
            return;

        }

        // ==========================
        // UPLOAD IMAGE
        // ==========================

        const imageURL =
            await uploadImage(file);

        // ==========================
        // METADATA
        // ==========================

        const tokenURI =
            await uploadMetadata(
                collectionName,
                imageURL
            );

        // ==========================
        // MINT NFT
        // ==========================

        const tx =
            await contract.mint(
                await signer.getAddress(),
                tokenURI,
                imageHash
            );

        const receipt =
            await tx.wait();

        // ==========================
        // TOKEN ID
        // ==========================

        let tokenId;

        for (const log of receipt.logs) {

            try {

                const parsed =
                    contract.interface.parseLog(log);

                if (parsed && parsed.name === "NFTMinted") {

                    tokenId =
                        Number(parsed.args[0]);

                    break;

                }

            }
            catch (e) { }

        }

        if (tokenId === undefined) {

            const next =
                await contract.nextTokenId();

            tokenId =
                Number(next) - 1;

        }

        // ==========================
        // SAVE TX HASH
        // ==========================

        let txHistory =
            JSON.parse(
                localStorage.getItem("erc721TxHistory")
            ) || {};

        txHistory[tokenId] =
            tx.hash;

        localStorage.setItem(
            "erc721TxHistory",
            JSON.stringify(txHistory)
        );

        // ==========================
        // SUCCESS CARD
        // ==========================

        document
            .getElementById("nftCard")
            .classList.remove("hidden");

        document
            .getElementById("mintedImage")
            .src =
            imageURL;

        document
            .getElementById("collectionName")
            .innerText =
            collectionName;

        document
            .getElementById("collectionSymbol")
            .innerText =
            collectionSymbol;

        document
            .getElementById("tokenId")
            .innerText =
            tokenId;

        document
            .getElementById("owner")
            .innerText =
            await signer.getAddress();

        document
            .getElementById("contractAddress")
            .innerText =
            ERC721_ADDRESS;

        document
            .getElementById("ipfsURL")
            .innerText =
            imageURL;

        document
            .getElementById("txHash")
            .innerText =
            tx.hash;

        document
            .getElementById("explorerLink")
            .href =
            `https://hoodi.etherscan.io/tx/${tx.hash}`;

        alert("NFT Minted Successfully");

        await loadGallery();

    }

    catch (err) {

        console.error(err);

        alert(
            err.reason ||
            err.message ||
            "Mint Failed"
        );

    }

}

// ==========================
// LOAD MY ERC721 GALLERY
// ==========================

async function loadGallery() {

    if (!signer) return;

    const gallery =
        document.getElementById("gallery");

    document
        .getElementById("gallerySection")
        .classList.remove("hidden");

    gallery.innerHTML = "";

    try {

        const contract =
            new ethers.Contract(
                ERC721_ADDRESS,
                ERC721_ABI,
                signer
            );

        const currentUser =
            await signer.getAddress();

        // Get only NFTs owned by connected wallet
        const tokenIds =
            await contract.getNFTsByOwner(currentUser);

        if (tokenIds.length === 0) {

            gallery.innerHTML = `
                <div class="bg-white rounded-xl shadow p-5 text-center">
                    <h3 class="text-lg font-semibold">
                        No NFTs Found
                    </h3>
                </div>
            `;

            return;
        }

        // ==========================
        // TX HISTORY (FROM BLOCKCHAIN, NOT localStorage)
        // ==========================
        // localStorage only exists on the browser/domain where the mint
        // happened, so it breaks on Vercel / other devices / other browsers.
        // Reading the NFTMinted event log works everywhere because it comes
        // straight from the chain.

        let txHistory = {};

        try {

            const localHistory =
                JSON.parse(
                    localStorage.getItem("erc721TxHistory")
                ) || {};

            txHistory = { ...localHistory };

            const mintEvents =
                await contract.queryFilter(
                    contract.filters.NFTMinted()
                );

            for (const ev of mintEvents) {

                if (ev.args && ev.args[0] !== undefined) {

                    txHistory[ev.args[0].toString()] =
                        ev.transactionHash;

                }

            }

        } catch (e) {

            console.error(
                "Could not load mint tx history from chain:",
                e
            );

        }

        for (const id of tokenIds) {

            try {

                const tokenId = Number(id);

                const owner =
                    await contract.ownerOf(tokenId);

                let uri =
                    await contract.tokenURI(tokenId);

                if (uri.startsWith("ipfs://")) {

                    uri =
                        uri.replace(
                            "ipfs://",
                            "https://gateway.pinata.cloud/ipfs/"
                        );

                }

                let metadata = {};

                try {

                    const response =
                        await fetch(uri);

                    metadata =
                        await response.json();

                }
                catch {

                    metadata = {};

                }

                let image =
                    metadata.image || "";

                if (
                    image &&
                    image.startsWith("ipfs://")
                ) {

                    image =
                        image.replace(
                            "ipfs://",
                            "https://gateway.pinata.cloud/ipfs/"
                        );

                }

                const txHash =
                    txHistory[tokenId];

                const explorerHref =
                    txHash
                        ? `https://hoodi.etherscan.io/tx/${txHash}`
                        : `https://hoodi.etherscan.io/address/${ERC721_ADDRESS}`;

                gallery.innerHTML += `

<div class="bg-white rounded-2xl shadow-lg border p-5">

    <img
        src="${image || 'https://placehold.co/350x300?text=No+Image'}"
        class="w-full h-52 object-cover rounded-xl border">

    <h3 class="text-xl font-bold text-blue-700 mt-4">
        ${metadata.name || "NFT"}
    </h3>

    <p>
        <b>Token ID:</b>
        ${tokenId}
    </p>

    <p class="break-all mt-3">
        <b>Owner:</b><br>
        ${owner}
    </p>

    <p class="break-all mt-3">
        <b>Contract:</b><br>
        ${ERC721_ADDRESS}
    </p>

    <p class="text-xs break-all bg-gray-100 p-2 rounded mt-3">
        <b>Image URL:</b><br>
        ${image || "Not available"}
    </p>

    <a
        href="${explorerHref}"
        target="_blank"
        class="block mt-4 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold">

        Hoodi Explorer

    </a>

</div>

`;

            }
            catch (err) {

                console.log("NFT skipped", err);

            }

        }

    }
    catch (err) {

        console.error(err);

        alert("Gallery Loading Failed");

    }

}



//********************************//
//************************************* *//


async function transferERC721() {

    try {

        if (!signer) {
            alert("Connect Wallet First");
            return;
        }

        const tokenId =
            document.getElementById("transfer721TokenId").value.trim();

        const to =
            document.getElementById("transfer721To").value.trim();

        if (!tokenId || !to) {
            alert("Fill all fields");
            return;
        }

        const contract =
            new ethers.Contract(
                ERC721_ADDRESS,
                ERC721_ABI,
                signer
            );

        const from =
            await signer.getAddress();

        const tx =
            await contract["safeTransferFrom(address,address,uint256)"](
                from,
                to,
                Number(tokenId)
            );

        await tx.wait();

        alert("NFT Transferred Successfully");

        await loadGallery();

    }
    catch (err) {

        console.error(err);

        alert(err.reason || err.message || "Transfer Failed");

    }

}



// ======================================================================================================================================
// CREATE ERC1155
// ======================================================================================================================================



async function createERC1155() {

    try {

        if (!signer) {

            alert("Connect Wallet First");
            return;

        }

        const to =
            document.getElementById("erc1155To").value.trim();

        const id =
            document.getElementById("erc1155Id").value.trim();

        const amount =
            document.getElementById("erc1155Amount").value.trim();

        const file =
            document.getElementById("erc1155Image").files[0];

        if (!to || !id || !amount) {

            alert("Fill all fields");
            return;

        }

        const contract =
            new ethers.Contract(
                ERC1155_ADDRESS,
                ERC1155_ABI,
                signer
            );

        const exists =
            await contract.exists(id);

        let tokenURI = "";
        let imageURL = "";
        let imageHash = "";

        // ==========================
        // NEW TOKEN
        // ==========================

        if (!exists) {

            if (!file) {

                alert("Select Image");
                return;

            }

            const buffer =
                await file.arrayBuffer();

            const hashBuffer =
                await crypto.subtle.digest(
                    "SHA-256",
                    buffer
                );

            imageHash =
                "0x" +
                Array.from(new Uint8Array(hashBuffer))
                    .map(x => x.toString(16).padStart(2, "0"))
                    .join("");

            imageURL =
                await uploadImage(file);

            tokenURI =
                await uploadMetadata(
                    `ERC1155 #${id}`,
                    imageURL
                );

        }

   // ==========================
// EXISTING TOKEN
// ==========================

else {

    // Don't allow another image for an existing Token ID
    if (file) {

        alert("Token ID already exists. Please do not select another image. Mint more copies of the existing NFT.");

        return;

    }

    tokenURI =
        await contract.uri(id);

    let metadataURL =
        tokenURI;

    if (metadataURL.startsWith("ipfs://")) {

        metadataURL =
            metadataURL.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
            );

    }

    const response =
        await fetch(metadataURL);

    const metadata =
        await response.json();

    imageURL =
        metadata.image;

    if (
        imageURL &&
        imageURL.startsWith("ipfs://")
    ) {

        imageURL =
            imageURL.replace(
                "ipfs://",
                "https://gateway.pinata.cloud/ipfs/"
            );

    }

    imageHash =
        await contract.getImageHash(id);

}
        // ==========================
        // MINT
        // ==========================

     const tx =
    await contract.mint(
        to,
        id,
        amount,
        tokenURI,
        imageHash
    );

const receipt = await tx.wait();
        // ==========================
        // SAVE TX HASH
        // ==========================

        let txHistory =
            JSON.parse(
                localStorage.getItem("erc1155TxHistory")
            ) || {};
txHistory[id.toString()] =
    receipt.hash;

        localStorage.setItem(
            "erc1155TxHistory",
            JSON.stringify(txHistory)
        );

        // ==========================
        // TOTAL COPIES
        // ==========================

        const totalCopies =
            await contract.totalCopies(id);

        // ==========================
        // SUCCESS CARD
        // ==========================

        document
            .getElementById("erc1155Card")
            .classList.remove("hidden");

        document
            .getElementById("erc1155MintedImage")
            .src =
            imageURL;

        document
            .getElementById("erc1155TokenId")
            .innerText =
            id;

        document
            .getElementById("erc1155Copies")
            .innerText =
            totalCopies.toString();

        document
            .getElementById("erc1155Owner")
            .innerText =
            to;

        const imageLink =
            document.getElementById(
                "erc1155ImageURL"
            );

        imageLink.href =
            imageURL;

        imageLink.innerText =
            imageURL;

       document
    .getElementById("erc1155TxHash")
    .innerText =
    receipt.hash;

      document
    .getElementById("erc1155Explorer")
    .href =
    `https://hoodi.etherscan.io/tx/${receipt.hash}`;

        alert("Mint Successful");

        await load1155Gallery();

        // ==========================
        // CLEAR FORM
        // ==========================

        document.getElementById("erc1155To").value = "";
        document.getElementById("erc1155Id").value = "";
        document.getElementById("erc1155Amount").value = "";
        document.getElementById("erc1155Image").value = "";

        const preview =
            document.getElementById("preview1155");

        if (preview) {

            preview.src = "";
            preview.classList.add("hidden");

        }

    }

   catch (err) {

    console.error(err);

    let message = "Mint Failed";

    if (err.reason) {

        message = err.reason;

    } else if (err.shortMessage) {

        message = err.shortMessage;

    } else if (err.message) {

        message = err.message;

    }

    if (message.includes("Image already used")) {

        alert("Image already used. Please select another image.");

    } else if (message.includes("Metadata mismatch")) {

        alert("This Token ID already exists with different metadata.");

    } else if (message.includes("Wrong image")) {

        alert("This Token ID already belongs to another image.");

    } else {

        alert(message);

    }

}

}


// ==========================
// TRANSFER ERC1155
// ==========================

async function transferERC1155() {

    try {

        if (!signer) {

            alert("Connect Wallet First");
            return;

        }

        const to =
            document.getElementById("transfer1155To").value.trim();

        const tokenId =
            document.getElementById("transfer1155TokenId").value.trim();

        const copies =
            document.getElementById("transfer1155Amount").value.trim();

        if (!to || !tokenId || !copies) {

            alert("Fill all fields");
            return;

        }

        const contract =
            new ethers.Contract(
                ERC1155_ADDRESS,
                ERC1155_ABI,
                signer
            );

        const from =
            await signer.getAddress();

        const balance =
            await contract.balanceOf(
                from,
                tokenId
            );

        if (Number(balance) < Number(copies)) {

            alert("Insufficient copies to transfer");
            return;

        }

        const tx =
            await contract.safeTransferFrom(
                from,
                to,
                tokenId,
                copies,
                "0x"
            );

        const receipt =
            await tx.wait();

        alert("ERC1155 transferred successfully!");

        document.getElementById("transfer1155To").value = "";
        document.getElementById("transfer1155TokenId").value = "";
        document.getElementById("transfer1155Amount").value = "";

        // Refresh gallery if it is visible
        const gallery =
            document.getElementById("gallery1155");

        if (
            gallery &&
            !gallery.classList.contains("hidden")
        ) {

            await load1155Gallery();

        }

        console.log(
            "Transfer Tx:",
            receipt.hash
        );

    }

    catch (err) {

        console.error(err);

        alert(
            err.reason ||
            err.message ||
            "Transfer Failed"
        );

    }

}



// ==========================
// TOGGLE ERC1155 GALLERY
// ==========================

async function toggle1155Gallery() {

    const section =
        document.getElementById("gallery1155");

    if (!section) return;

    if (section.classList.contains("hidden")) {

        section.classList.remove("hidden");

        await load1155Gallery();

    }

    else {

        section.classList.add("hidden");

    }

}




// ==========================
// ERC1155 GALLERY
// ==========================

async function load1155Gallery() {

    const gallery =
        document.getElementById("gallery1155Grid");

    gallery.innerHTML = "";

    if (!signer) {

        gallery.innerHTML =
            "<p>Connect Wallet First</p>";

        return;

    }

    try {

        const contract =
            new ethers.Contract(
                ERC1155_ADDRESS,
                ERC1155_ABI,
                signer
            );

        const owner =
            await signer.getAddress();

        const tokenIds =
            await contract.getMyTokens();

        // ==========================
        // TX HISTORY (FROM BLOCKCHAIN, NOT localStorage)
        // ==========================
        // Same reasoning as the ERC721 gallery: localStorage doesn't
        // travel with the app to Vercel / other browsers / other devices,
        // so we look up the real mint transaction hash on-chain instead.
        // TransferSingle "id" isn't an indexed topic, so we fetch every
        // mint (from = zero address) once and match the id client-side.

        let txHistory = {};

        try {

            const localHistory =
                JSON.parse(
                    localStorage.getItem("erc1155TxHistory") || "{}"
                );

            txHistory = { ...localHistory };

            const mintFilter =
                contract.filters.TransferSingle(
                    null,
                    ethers.ZeroAddress,
                    null
                );

            const mintEvents =
                await contract.queryFilter(mintFilter);

            for (const ev of mintEvents) {

                if (ev.args && ev.args.id !== undefined) {

                    const idKey =
                        ev.args.id.toString();

                    if (!(idKey in txHistory)) {

                        txHistory[idKey] =
                            ev.transactionHash;

                    }

                }

            }

        } catch (e) {

            console.error(
                "Could not load mint tx history from chain:",
                e
            );

        }

        if (tokenIds.length === 0) {

            gallery.innerHTML = `
                <div class="border rounded-lg p-4 bg-white text-center">
                    No ERC1155 NFTs Found
                </div>
            `;

            return;

        }

        for (const tokenId of tokenIds) {

            try {

                const balance =
                    await contract.balanceOf(
                        owner,
                        tokenId
                    );

                if (balance === 0n) {

                    continue;

                }

                let metadataURL =
                    await contract.uri(tokenId);

                if (metadataURL.startsWith("ipfs://")) {

                    metadataURL =
                        metadataURL.replace(
                            "ipfs://",
                            "https://gateway.pinata.cloud/ipfs/"
                        );

                }

                let metadata = {};

                try {

                    const response =
                        await fetch(metadataURL);

                    metadata =
                        await response.json();

                }

                catch {

                    metadata = {};

                }

                let image =
                    metadata.image || "";

                if (
                    image &&
                    image.startsWith("ipfs://")
                ) {

                    image =
                        image.replace(
                            "ipfs://",
                            "https://gateway.pinata.cloud/ipfs/"
                        );

                }

                const copies =
                    await contract.totalCopies(
                        tokenId
                    );

                // ==========================
                // TRANSACTION
                // ==========================

                const txHash =
                    txHistory[tokenId.toString()] || "";

                const explorerHref =
                    txHash
                        ? `https://hoodi.etherscan.io/tx/${txHash}`
                        : "#";

                gallery.innerHTML += `

<div class="border rounded-xl shadow-lg bg-white p-4">

    <img
        src="${image || "https://placehold.co/350x300?text=No+Image"}"
        class="w-full h-48 object-cover rounded-lg">

    <h3 class="font-bold text-lg mt-3">
        Token ID : ${tokenId.toString()}
    </h3>

    <p class="mt-2">
        <b>Total Copies :</b>
        ${copies.toString()}
    </p>

    <p>
        <b>Your Balance :</b>
        ${balance.toString()}
    </p>

    <p class="break-all mt-2">
        <b>Owner :</b><br>
        ${owner}
    </p>

    <p class="break-all mt-2">
        <b>Transaction Hash :</b><br>
        ${txHash || "Not Available"}
    </p>

    <p class="break-all mt-2">
        <b>Image URL :</b><br>
        ${image || "Not Available"}
    </p>

    ${
        txHash
            ? `
        <a
            href="${explorerHref}"
            target="_blank"
            class="block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            View Transaction
        </a>
        `
            : `
        <div
            class="block mt-4 text-center bg-gray-400 text-white py-2 rounded-lg">
            Transaction Not Available
        </div>
        `
    }

</div>

`;

            }

            catch (err) {

                console.error(
                    "NFT skipped:",
                    err
                );

            }

        }

    }

    catch (err) {

        console.error(err);

        gallery.innerHTML =
            "<p class='text-red-600'>Failed to Load Gallery</p>";

    }

}



// ==========================
// REFRESH DAPP
// ==========================

function refreshDApp() {

    // ==========================
    // ERC20
    // ==========================

    document.getElementById("erc20Name").value = "";
    document.getElementById("erc20Symbol").value = "";
    document.getElementById("erc20Supply").value = "";

    // Transfer Section

    const transferToken =
        document.getElementById("transferToken");

    if (transferToken)
        transferToken.value = "";

    const transferTo =
        document.getElementById("transferTo");

    if (transferTo)
        transferTo.value = "";

    const transferAmount =
        document.getElementById("transferAmount");

    if (transferAmount)
        transferAmount.value = "";

    const transferSuccessCard =
        document.getElementById("transferSuccessCard");

    if (transferSuccessCard)
        transferSuccessCard.classList.add("hidden");

    const transferResult =
        document.getElementById("transferResult");

    if (transferResult)
        transferResult.classList.add("hidden");

    // Hide ERC20 List

    const erc20List =
        document.getElementById("erc20List");

    if (erc20List)
        erc20List.classList.add("hidden");

    const erc20ListContainer =
        document.getElementById("erc20ListContainer");

    if (erc20ListContainer)
        erc20ListContainer.innerHTML = "";

    // Hide Success Card

    const erc20Card =
        document.getElementById("erc20Card");

    if (erc20Card)
        erc20Card.classList.add("hidden");

    document.getElementById("tokenName").innerHTML = "";
    document.getElementById("tokenSymbol").innerHTML = "";
    document.getElementById("tokenSupply").innerHTML = "";
    document.getElementById("tokenContract").innerHTML = "";
    document.getElementById("tokenOwner").innerHTML = "";
    document.getElementById("tokenTx").innerHTML = "";
    document.getElementById("status").innerHTML = "";

    // ==========================
    // ERC721
    // ==========================

    document.getElementById("erc721Name").value = "";
    document.getElementById("erc721Symbol").value = "";
    document.getElementById("erc721Image").value = "";



    // Clear Transfer Inputs
const transfer721TokenId =
    document.getElementById("transfer721TokenId");

if (transfer721TokenId)
    transfer721TokenId.value = "";

const transfer721To =
    document.getElementById("transfer721To");

if (transfer721To)
    transfer721To.value = "";


    const preview721 =
        document.getElementById("preview721");

    preview721.src = "";
    preview721.classList.add("hidden");

    const nftCard =
        document.getElementById("nftCard");

    nftCard.classList.add("hidden");

    document.getElementById("collectionName").innerHTML = "";
    document.getElementById("collectionSymbol").innerHTML = "";
    document.getElementById("tokenId").innerHTML = "";
    document.getElementById("owner").innerHTML = "";
    document.getElementById("contractAddress").innerHTML = "";
    document.getElementById("txHash").innerHTML = "";

    document.getElementById("mintedImage").src = "";

    const imageLink =
        document.getElementById("imageLink");

    if (imageLink)
        imageLink.href = "#";

    const explorerLink =
        document.getElementById("explorerLink");

    if (explorerLink)
        explorerLink.href = "#";

    const gallerySection =
        document.getElementById("gallerySection");

    gallerySection.classList.add("hidden");

    const gallery =
        document.getElementById("gallery");

    if (gallery)
        gallery.innerHTML = "";

    // ==========================
    // ERC1155
    // ==========================

    document.getElementById("erc1155To").value = "";
    document.getElementById("erc1155Id").value = "";
    document.getElementById("erc1155Amount").value = "";
    document.getElementById("erc1155Image").value = "";

    const preview1155 =
        document.getElementById("preview1155");

    preview1155.src = "";
    preview1155.classList.add("hidden");

    const erc1155Card =
        document.getElementById("erc1155Card");

    if (erc1155Card)
        erc1155Card.classList.add("hidden");

    document.getElementById("erc1155MintedImage").src = "";
    document.getElementById("erc1155TokenId").innerHTML = "";
    document.getElementById("erc1155Copies").innerHTML = "";
    document.getElementById("erc1155Owner").innerHTML = "";
    document.getElementById("erc1155TxHash").innerHTML = "";

    const erc1155ImageLink =
        document.getElementById("erc1155ImageLink");

    if (erc1155ImageLink)
        erc1155ImageLink.href = "#";

    const erc1155Explorer =
        document.getElementById("erc1155Explorer");

    if (erc1155Explorer)
        erc1155Explorer.href = "#";

    const gallery1155 =
        document.getElementById("gallery1155");

    gallery1155.classList.add("hidden");

    const gallery1155Grid =
        document.getElementById("gallery1155Grid");

    if (gallery1155Grid)
        gallery1155Grid.innerHTML = "";
// ==========================
// CLEAR ERC1155 TRANSFER
// ==========================

const transfer1155To =
    document.getElementById("transfer1155To");

if (transfer1155To)
    transfer1155To.value = "";

const transfer1155TokenId =
    document.getElementById("transfer1155TokenId");

if (transfer1155TokenId)
    transfer1155TokenId.value = "";

const transfer1155Amount =
    document.getElementById("transfer1155Amount");

if (transfer1155Amount)
    transfer1155Amount.value = "";

}


// ==========================
// WINDOW LOAD
// ==========================

window.onload = function () {

    document.getElementById("walletAddress").innerText =
        "Not Connected";

};