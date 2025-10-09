import { ethers } from 'ethers';
import { ETH_RPC_URL } from '../utils/config';

class EthereumService {
  constructor() {
    // Ethers v6: JsonRpcProvider is directly on ethers, not ethers.providers
    this.provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
    this.wallet = null;
    console.log(
      'TrustWallet: Ethereum provider initialized with:',
      ETH_RPC_URL,
    );
  }

  // Initialize wallet from mnemonic using BIP-44 path: m/44'/60'/0'/0
  initializeWallet(mnemonic) {
    try {
      // Clean the mnemonic
      const cleanedMnemonic = mnemonic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      // Validate mnemonic - v6 syntax
      if (!ethers.Mnemonic.isValidMnemonic(cleanedMnemonic)) {
        throw new Error('Invalid recovery phrase');
      }

      // Create wallet from mnemonic with BIP-44 path for first ETH account
      const path = "m/44'/60'/0'/0/0";

      // v6 syntax: HDNodeWallet.fromPhrase
      const wallet = ethers.HDNodeWallet.fromPhrase(cleanedMnemonic, path);

      // Connect to provider
      this.wallet = wallet.connect(this.provider);

      console.log(
        'TrustWallet: Wallet initialized with address:',
        this.getAddress(),
      );
      return this.getAddress();
    } catch (error) {
      console.error('TrustWallet: Failed to initialize wallet:', error);
      throw new Error('Failed to initialize wallet: ' + error.message);
    }
  }

  // Get checksummed address (EIP-55) - v6 syntax
  getAddress() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return ethers.getAddress(this.wallet.address);
  }

  // Get ETH balance in ETH units (not wei) - v6 syntax
  async getBalance() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const balanceWei = await this.provider.getBalance(this.wallet.address);
      const balanceEth = ethers.formatEther(balanceWei);
      console.log('TrustWallet: Balance fetched:', balanceEth, 'ETH');
      return balanceEth;
    } catch (error) {
      console.error('TrustWallet: Error fetching balance:', error);
      throw new Error('Failed to fetch balance: ' + error.message);
    }
  }

  // Generate new wallet with 12-word mnemonic - v6 syntax
  generateNewWallet() {
    try {
      const wallet = ethers.Wallet.createRandom();
      console.log('TrustWallet: New wallet generated');

      return {
        mnemonic: wallet.mnemonic.phrase,
        address: ethers.getAddress(wallet.address),
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error('TrustWallet: Failed to generate new wallet:', error);
      throw new Error('Failed to generate wallet: ' + error.message);
    }
  }

  // Validate mnemonic - v6 syntax
  validateMnemonic(mnemonic) {
    try {
      const cleanedMnemonic = mnemonic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');
      return ethers.Mnemonic.isValidMnemonic(cleanedMnemonic);
    } catch (error) {
      return false;
    }
  }
}

// Create a singleton instance
const EthereumServiceInstance = new EthereumService();
export default EthereumServiceInstance;
