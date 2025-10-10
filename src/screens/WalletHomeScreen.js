import React, { useState, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import EthereumServiceInstance from '../services/EthereumService';
import WalletStorageInstance from '../services/WalletStorage';

const WalletHomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const initialLoadRef = useRef(false);

  const loadWalletData = async () => {
    try {
      setIsLoading(true);
      const mnemonic = await WalletStorageInstance.getMnemonic();
      if (mnemonic) {
        const address = EthereumServiceInstance.initializeWallet(mnemonic);
        setAddress(address);

        const walletBalance = await EthereumServiceInstance.getBalance();
        setBalance(parseFloat(walletBalance).toFixed(6));
      }
    } catch (error) {
      console.log('Wallet load error:', error.message);
      if (!error.message.includes('balance')) {
        Alert.alert('Error', 'Failed to load wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setString(address);
      setCopyFeedback('✓ Copied!');

      setTimeout(() => {
        setCopyFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
      Alert.alert('Error', 'Failed to copy address to clipboard');
    }
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  useEffect(() => {
    if (isFocused && !initialLoadRef.current) {
      initialLoadRef.current = true;
      loadWalletData();
    }
  }, [isFocused]);

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
      <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
        <Icon name="settings-outline" size={24} color="#3375BB" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Trust Wallet</Text>
          <Text style={styles.subtitle}>Your Ethereum Wallet</Text>
        </View>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>{balance || '0.0'} ETH</Text>
        </View>

        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Your Address</Text>
          {copyFeedback ? (
            <View style={styles.copyFeedback}>
              <Text style={styles.copyFeedbackText}>{copyFeedback}</Text>
            </View>
          ) : null}

          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{address}</Text>
          </View>

          <View style={styles.addressButtons}>
            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopyAddress}
            >
              <Text style={styles.buttonText}>
                {copyFeedback ? 'Copied!' : 'Copy Address'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.qrButton]}
              onPress={handleShowQR}
            >
              <Text style={styles.buttonText}>Show QR Code</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.addressHint}>
            Tap and hold the address to select text, or use the copy button
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={showQRModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseQR}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Address QR Code</Text>
            <View style={styles.qrContainer}>
              {address ? (
                <QRCode
                  value={address}
                  size={250}
                  backgroundColor="white"
                  color="black"
                />
              ) : (
                <Text>Loading QR code...</Text>
              )}
            </View>
            <View style={styles.qrAddressContainer}>
              <Text style={styles.qrAddressText}>{address}</Text>
            </View>
            <Text style={styles.qrInstructions}>
              Scan this QR code to receive ETH or ERC-20 tokens
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={handleCloseQR}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitleContainer: {
    marginTop: '-5%',
    marginBottom: '10%',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
    alignSelf: 'flex-end',
    paddingTop: 15,
    paddingBottom: 10,
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
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3375BB',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#3375BB',
    padding: 29,
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
  copyFeedback: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyFeedbackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    userSelect: 'all',
  },
  addressButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  addressHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
  closeButton: {
    backgroundColor: '#6c757d',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    width: '90%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 15,
  },
  qrAddressContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
  },
  qrAddressText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default WalletHomeScreen;
