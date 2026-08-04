# Token Creator DApp

## Project Overview

Token Creator DApp is a decentralized web application that allows users to create and manage Ethereum tokens without writing Solidity smart contracts. The application provides a simple and user-friendly interface for creating **ERC20**, **ERC721**, and **ERC1155** tokens on the **Ethereum Hoodi Testnet**.

The application integrates MetaMask for wallet connectivity, Ethers.js for blockchain interactions, Pinata for decentralized IPFS storage, and Alchemy as the RPC provider. Users can create tokens, mint NFTs, transfer assets, and view their owned NFTs through an intuitive interface.

---

# Features

## ERC20

* Create ERC20 tokens
* View created ERC20 tokens
* Transfer ERC20 tokens
* Display token information
* Add created token to MetaMask

## ERC721

* Create ERC721 NFTs
* Upload NFT images to IPFS
* Automatically generate metadata
* Mint NFTs
* View NFT Gallery
* Transfer NFTs
* View transaction on Hoodi Explorer

## ERC1155

* Mint ERC1155 NFTs
* Mint multiple copies of the same NFT
* Upload metadata to IPFS
* View ERC1155 Gallery
* Transfer ERC1155 copies
* View transaction on Hoodi Explorer

---

# Technologies Used

| Technology             | Purpose                |
| ---------------------- | ---------------------- |
| HTML5                  | Frontend               |
| Tailwind CSS           | User Interface         |
| JavaScript             | Application Logic      |
| Ethers.js v6           | Blockchain Interaction |
| Solidity               | Smart Contracts        |
| OpenZeppelin Contracts | ERC Standards          |
| MetaMask               | Wallet Connection      |
| Pinata                 | IPFS Storage           |
| Alchemy                | Hoodi RPC Provider     |

---

# Project Structure

```text
INTERNSHIP/
│
├── contracts/
│   ├── MyERC20.sol
│   ├── ERC20Factory.sol
│   ├── MyNFT.sol
│   ├── ERC721Factory.sol
│   └── MyERC1155.sol
│
├── index.html
├── app.js
├── README.md
└── .env.example
```

---

# Prerequisites

Before running the project, ensure the following software is installed on your system.

* Git
* Node.js (Version 18 or later)
* npm
* Visual Studio Code
* Live Server Extension for Visual Studio Code
* MetaMask Browser Extension

You also need accounts for:

* Alchemy
* Pinata

---

# Dependencies

Install project dependencies.

```bash
npm install
```

If you want to compile or modify the smart contracts:

```bash
npm install @openzeppelin/contracts
```

The frontend uses:

* Tailwind CSS
* Ethers.js Version 6

---

# Installation

## Step 1: Clone the Repository

Clone using HTTPS

```bash
git clone https://github.com/varshaprasadav/INTERNSHIP.git
```

Or clone using SSH

```bash
git clone git@github.com:varshaprasadav/INTERNSHIP.git
```

---

## Step 2: Navigate to the Project Folder

```bash
cd INTERNSHIP
```

---

## Step 3: Open the Project

Open the project using Visual Studio Code.

```bash
code .
```

or manually open the project folder in Visual Studio Code.

---

# Environment Configuration

Create a file named

```
.env
```

inside the project directory.

Example

```env
HOODI_RPC_URL=YOUR_ALCHEMY_RPC_URL

PRIVATE_KEY=YOUR_PRIVATE_KEY

PINATA_JWT=YOUR_PINATA_JWT
```

**Important**

Do not upload your private key, Pinata JWT, or `.env` file to GitHub.

---

# Configure Alchemy

1. Create an Alchemy account.
2. Create a new application.
3. Select the **Ethereum Hoodi Testnet** network.
4. Copy the generated RPC URL.
5. Replace `HOODI_RPC_URL` in the `.env` file with your RPC URL.

---

# Configure Pinata

1. Create a Pinata account.
2. Generate a JWT token.
3. Replace `PINATA_JWT` with your generated token.

Pinata is used to upload:

* NFT Images
* NFT Metadata

---

# Configure MetaMask

Install the MetaMask browser extension.

Add the Hoodi Testnet using the following configuration.

| Field           | Value                      |
| --------------- | -------------------------- |
| Network Name    | Hoodi Testnet              |
| RPC URL         | Your Alchemy Hoodi RPC URL |
| Chain ID        | 560048                     |
| Currency Symbol | ETH                        |

After adding the network:

* Switch MetaMask to Hoodi Testnet.
* Import or create a wallet.
* Obtain Hoodi Test ETH from a Hoodi Faucet.

---

# Running the Application

After completing the above configuration, follow these steps.

### Start the Application

Open the project folder in Visual Studio Code.

Open the file

```
index.html
```

Right-click and select

```
Open with Live Server
```

The application opens in your browser.

Default URL

```
http://127.0.0.1:5500
```

---

# Getting Started

Once the application opens:

### 1. Connect Wallet

Click **Connect Wallet**.

Approve the MetaMask connection request.

Your wallet address will appear on the screen.

---

### 2. Select Token Type

Choose one of the following:

* ERC20
* ERC721
* ERC1155

---

# Using the Application

## ERC20

1. Select the ERC20 tab.
2. Enter the Token Name.
3. Enter the Token Symbol.
4. Enter the Total Supply.
5. Click **Create ERC20**.
6. Wait for transaction confirmation.
7. View token details.
8. Add the token to MetaMask.
9. View your created ERC20 tokens.
10. Transfer ERC20 tokens to another wallet.

---

## ERC721

1. Select the ERC721 tab.
2. Enter Collection Name.
3. Enter Collection Symbol.
4. Upload an NFT image.
5. Click **Create NFT**.
6. Wait for image upload to Pinata.
7. Metadata is automatically generated.
8. NFT is minted.
9. View the NFT Gallery.
10. Transfer NFTs using the Token ID.
11. View the transaction on Hoodi Explorer.

---

## ERC1155

1. Select the ERC1155 tab.
2. Enter Recipient Address.
3. Enter Token ID.
4. Enter Number of Copies.
5. Upload an NFT image.
6. Click **Mint ERC1155**.
7. Wait for minting.
8. View ERC1155 Gallery.
9. Transfer copies using the Transfer section.
10. Verify the transaction on Hoodi Explorer.

---

# Application Workflow

```text
                           Start
                             │
                             ▼
                  Clone Repository
                             │
                             ▼
                  Install Prerequisites
                             │
                             ▼
                 Configure Environment
                             │
                             ▼
                Configure MetaMask Network
                             │
                             ▼
                  Open with Live Server
                             │
                             ▼
                   Connect MetaMask Wallet
                             │
                             ▼
                 Select Token Standard
          ┌──────────────┬──────────────┬──────────────┐
          │              │              │
          ▼              ▼              ▼
       ERC20         ERC721         ERC1155
          │              │              │
          │         Upload Image   Upload Image
          │              │              │
          │              ▼              ▼
          │      Upload Metadata to IPFS
          │              │
          └──────────────┼──────────────┘
                         ▼
                 Create / Mint Token
                         │
                         ▼
               Display Success Details
                         │
                         ▼
             View Tokens / NFT Gallery
                         │
                         ▼
                 Transfer Tokens/NFTs
                         │
                         ▼
          Verify Transaction on Hoodi Explorer
```

---

# Testing the Application

To verify the application is working correctly:

### ERC20

* Connect MetaMask.
* Create an ERC20 token.
* View the created token.
* Add it to MetaMask.
* Transfer tokens to another account.

### ERC721

* Mint an NFT.
* Verify the NFT appears in the gallery.
* Transfer the NFT.
* Verify ownership after transfer.
* Open the Hoodi Explorer transaction.

### ERC1155

* Mint an ERC1155 NFT.
* Mint additional copies using the same Token ID.
* Verify balances.
* Transfer NFT copies.
* Verify the gallery updates correctly.
* Open the Hoodi Explorer transaction.

---

# Additional Information

* The application works only on the Ethereum Hoodi Testnet.
* MetaMask must remain connected while performing transactions.
* Users must have Hoodi Test ETH for gas fees.
* NFT images and metadata are stored on IPFS using Pinata.
* Blockchain transactions can be verified using Hoodi Explorer.

---

# Repository

GitHub Repository

```
https://github.com/varshaprasadav/INTERNSHIP
```

Clone using HTTPS

```bash
git clone https://github.com/varshaprasadav/INTERNSHIP.git
```

Clone using SSH

```bash
git clone git@github.com:varshaprasadav/INTERNSHIP.git
```

---

# Future Improvements

* Burn ERC20 Tokens
* Burn NFTs
* Batch ERC1155 Minting
* Multi-chain Support
* Wallet Dashboard
* Search and Filter Tokens
* NFT Metadata Editing

---

# Author

**Varsha Prasad**

GitHub: https://github.com/varshaprasadav

Repository: https://github.com/varshaprasadav/INTERNSHIP
