import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EthereumServiceInstance from '../services/EthereumService'; // Updated import
import WalletStorageInstance from '../services/WalletStorage'; // Updated import

const WalletHomeScreen = () => {
  const navigation = useNavigation();
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);

      // Get mnemonic from storage
      const mnemonic = await WalletStorageInstance.getMnemonic(); // Updated
      if (mnemonic) {
        // Initialize wallet with the mnemonic
        const address = EthereumServiceInstance.initializeWallet(mnemonic); // Updated
        setAddress(address);

        // Get balance
        const walletBalance = await EthereumServiceInstance.getBalance(); // Updated
        setBalance(parseFloat(walletBalance).toFixed(6));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load wallet data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = () => {
    Alert.alert('Copied!', 'Address copied to clipboard');
  };

  const handleShowQR = () => {
    Alert.alert('QR Code', 'QR code will be shown here');
  };

  const handleResetWallet = () => {
    Alert.alert(
      'Reset Wallet',
      'This will delete your current wallet. Make sure you have backed up your recovery phrase!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await WalletStorageInstance.deleteWallet(); // Updated
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to reset wallet');
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  // ... rest of your component remains the same

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3375BB" />
          <Text style={styles.loadingText}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>TrustWallet</Text>
          <Text style={styles.subtitle}>Your Ethereum Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>{balance} ETH</Text>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Your Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{address}</Text>
          </View>

          <View style={styles.addressButtons}>
            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopyAddress}
            >
              <Text style={styles.buttonText}>Copy Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.qrButton]}
              onPress={handleShowQR}
            >
              <Text style={styles.buttonText}>Show QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Wallet Actions</Text>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={loadWalletData}
          >
            <Text style={styles.buttonText}>Refresh Balance</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.warningButton]}
            onPress={handleResetWallet}
          >
            <Text style={styles.buttonText}>Reset Wallet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3375BB',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  balanceCard: {
    backgroundColor: '#3375BB',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  addressSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  addressContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 15,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  addressButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionsSection: {
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyButton: {
    flex: 1,
    backgroundColor: '#6c757d',
  },
  qrButton: {
    flex: 1,
    backgroundColor: '#28a745',
  },
  primaryButton: {
    backgroundColor: '#3375BB',
  },
  warningButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WalletHomeScreen;
