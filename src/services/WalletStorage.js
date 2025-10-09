import * as Keychain from 'react-native-keychain';
// REMOVE EthereumService import - no circular dependency

const WALLET_SERVICE = 'mini_trust_wallet';
const MNEMONIC_KEY = 'wallet_mnemonic';

class WalletStorage {
  // Save mnemonic to secure storage
  async saveMnemonic(mnemonic) {
    try {
      await Keychain.setGenericPassword(MNEMONIC_KEY, mnemonic, {
        service: WALLET_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      console.log('TrustWallet: Mnemonic saved securely');
      return true;
    } catch (error) {
      console.error('TrustWallet: Failed to save mnemonic:', error);
      throw error;
    }
  }

  // Get mnemonic from secure storage
  async getMnemonic() {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: WALLET_SERVICE,
      });

      if (credentials) {
        console.log('TrustWallet: Mnemonic retrieved from secure storage');
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('TrustWallet: Failed to retrieve mnemonic:', error);
      throw error;
    }
  }

  // Check if wallet exists
  async walletExists() {
    try {
      const mnemonic = await this.getMnemonic();
      return !!mnemonic;
    } catch (error) {
      return false;
    }
  }

  // Delete wallet (reset)
  async deleteWallet() {
    try {
      await Keychain.resetGenericPassword({
        service: WALLET_SERVICE,
      });
      console.log('TrustWallet: Wallet data cleared');
      return true;
    } catch (error) {
      console.error('TrustWallet: Failed to delete wallet:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const WalletStorageInstance = new WalletStorage();
export default WalletStorageInstance;
