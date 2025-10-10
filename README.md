# React Native Mini Trust Wallet

A minimal Ethereum wallet implementation built with React Native for Android, featuring secure key management, BIP-39 mnemonic support, and real-time balance tracking.

## 🚀 Features

- **Secure Wallet Creation**: Generate 12-word BIP-39 mnemonic phrases
- **Wallet Import**: Import existing wallets using 12/24-word mnemonics
- **BIP-44 Compliance**: Standard derivation path `m/44'/60'/0'/0/0` for Ethereum
- **EIP-55 Addresses**: Checksummed Ethereum addresses for security
- **Secure Storage**: Mnemonic stored in react native Keychain
- **QR Code Support**: Share your address via scannable QR codes
- **Real-time Balance**: Live ETH balance via Cloudflare Ethereum Gateway
- **Security Features**: Backup verification and secure reset functionality

## 📋 Requirements

- Node.js 16+
- React Native CLI
- Android Emulator or Android Device
- Ethereum RPC endpoint (Cloudflare)

🏗 Architecture
##Project Structure
src/
├── navigation/
│ └── AppNavigator.js # Main navigation stack
├── screens/
│ ├── WelcomeScreen.js # Landing page with create/import options
│ ├── CreateWalletScreen.js # New wallet generation
│ ├── ImportWalletScreen.js # Existing wallet import
│ ├── WalletHomeScreen.js # Main wallet dashboard
│ └── SettingsScreen.js # Backup and reset functionality
├── services/
│ ├── EthereumService.js # Blockchain interactions
│ └── WalletStorage.js # Secure storage management
└── utils/
└── config.js # Environment configuration

##Key Components
EthereumService: Handles all blockchain operations using ethers.js v6

WalletStorage: Manages secure storage via react-native-keychain

AppNavigator: Controls screen flow and navigation state

🔐 Security Implementation
##Secure Storage
Android: Uses EncryptedSharedPreferences via react-native-keychain

Mnemonic Protection: Never stored in plaintext; encrypted at rest

##Key Derivation
BIP-39: 12-word mnemonic generation and validation

BIP-44: Standard Ethereum derivation path m/44'/60'/0'/0/0

EIP-55: Checksummed addresses to prevent typos

##Security Features
Backup confirmation before wallet access

Warning screens before revealing recovery phrases

Secure wipe on wallet reset

Timeout handling for RPC calls

Acceptance Tests
##Create Wallet Flow

Generate new 12-word mnemonic

Confirm backup → Navigate to WalletHome

Verify checksummed address, QR code, and balance display

##Import Wallet Flow

Reset app → Import test mnemonic

Verify address matches expected test address

Confirm balance fetches without errors

##Security Features

Backup flow shows warning before revealing seed

Copy functionality works for address and mnemonic

Reset wallet clears all secure storage

###Ethers.js v6 Usage
ethers.Wallet.createRandom() for mnemonic generation

ethers.HDNodeWallet.fromPhrase() for BIP-44 derivation

ethers.getAddress() for EIP-55 checksum

ethers.formatEther() for balance conversion

🤖 AI Usage
##AI Assistance
Code Scaffolding: Initial component structure and service setup

Bug Fixes: Assistance with ethers.js v6 migration and async handling

Documentation: README template and technical explanations

Files with AI Assistance
EthereumService.js (ethers v6 migration)

WalletStorage.js (secure storage implementation)

Screen components (UI logic and state management)
