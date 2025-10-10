import * as Keychain from 'react-native-keychain';

const WALLET_SERVICE = 'mini_trust_wallet';
const MNEMONIC_KEY = 'wallet_mnemonic';

class WalletStorage {
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

  async walletExists() {
    try {
      const mnemonic = await this.getMnemonic();
      return !!mnemonic;
    } catch (error) {
      return false;
    }
  }

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

const WalletStorageInstance = new WalletStorage();
export default WalletStorageInstance;
