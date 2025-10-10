import { ethers } from 'ethers';
import { ETH_RPC_URL } from '../utils/config';

class EthereumService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
    this.wallet = null;
    console.log(
      'TrustWallet: Ethereum provider initialized with:',
      ETH_RPC_URL,
    );
  }

  initializeWallet(mnemonic) {
    try {
      const cleanedMnemonic = mnemonic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      if (!ethers.Mnemonic.isValidMnemonic(cleanedMnemonic)) {
        throw new Error('Invalid recovery phrase');
      }

      const path = "m/44'/60'/0'/0/0";
      const wallet = ethers.HDNodeWallet.fromPhrase(cleanedMnemonic, path);
      this.wallet = wallet.connect(this.provider);
      return this.getAddress();
    } catch (error) {
      console.error('TrustWallet: Failed to initialize wallet:', error);
      throw new Error('Failed to initialize wallet: ' + error.message);
    }
  }

  getAddress() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    return ethers.getAddress(this.wallet.address);
  }

  async getBalance() {
    if (!this.wallet) {
      throw new Error('Wallet not initialized');
    }
    try {
      const balanceWei = await Promise.race([
        this.provider.getBalance(this.wallet.address),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000),
        ),
      ]);

      const balanceEth = ethers.formatEther(balanceWei);
      console.log('TrustWallet: Balance fetched:', balanceEth, 'ETH');
      return balanceEth;
    } catch (error) {
      console.error('TrustWallet: Error fetching balance:', error);
      if (
        error.message.includes('timeout') ||
        error.message.includes('Internal error')
      ) {
        return '0';
      }

      throw new Error('Failed to fetch balance: ' + error.message);
    }
  }

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

const EthereumServiceInstance = new EthereumService();
export default EthereumServiceInstance;
