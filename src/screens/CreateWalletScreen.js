import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import EthereumServiceInstance from '../services/EthereumService';
import WalletStorageInstance from '../services/WalletStorage';

const CreateWalletScreen = () => {
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const generateWallet = () => {
    try {
      const newMnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      setMnemonic(newMnemonic);
      setIsConfirmed(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate wallet: ' + error.message);
    }
  };

  const confirmBackup = async () => {
    if (!mnemonic) return;

    try {
      await WalletStorageInstance.saveMnemonic(mnemonic);
      EthereumServiceInstance.initializeWallet(mnemonic);

      navigation.reset({
        index: 0,
        routes: [{ name: 'WalletHome' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save wallet: ' + error.message);
    }
  };

  const handleBackupConfirmed = () => {
    Alert.alert(
      'Confirm Backup',
      'Have you securely backed up your recovery phrase? You will need it to restore your wallet.',
      [
        { text: 'Not yet', style: 'cancel' },
        {
          text: 'Yes, I backed it up',
          onPress: () => setIsConfirmed(true),
        },
      ],
    );
  };

  useEffect(() => {
    if (!mnemonic) {
      generateWallet();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Recovery Phrase</Text>
          <Text style={styles.subtitle}>
            Write down these 12 words in order and store them in a safe place.
            Never share your recovery phrase with anyone!
          </Text>
        </View>

        {mnemonic ? (
          <View style={styles.mnemonicContainer}>
            {mnemonic.split(' ').map((word, index) => (
              <View key={index} style={styles.wordContainer}>
                <Text style={styles.wordNumber}>{index + 1}.</Text>
                <Text style={styles.word}>{word}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.loadingText}>Generating wallet...</Text>
        )}

        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={generateWallet}
        >
          <Text style={styles.regenerateText}>Generate New Phrase</Text>
        </TouchableOpacity>

        <View style={styles.confirmContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleBackupConfirmed}
            disabled={!mnemonic}
          >
            <Text style={styles.confirmButtonText}>
              I've backed up my recovery phrase
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isConfirmed || !mnemonic) && styles.continueButtonDisabled,
            ]}
            onPress={confirmBackup}
            disabled={!isConfirmed || !mnemonic}
          >
            <Text style={styles.continueButtonText}>Continue to Wallet</Text>
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
    paddingVertical: 30,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  mnemonicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  wordNumber: {
    fontSize: 12,
    color: '#666',
    marginRight: 5,
    minWidth: 20,
  },
  word: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginVertical: 40,
  },
  regenerateButton: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  regenerateText: {
    color: '#3375BB',
    fontSize: 16,
  },
  confirmContainer: {
    gap: 15,
  },
  confirmButton: {
    backgroundColor: '#3375BB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateWalletScreen;
