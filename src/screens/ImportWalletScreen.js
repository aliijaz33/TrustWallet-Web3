import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import EthereumServiceInstance from '../services/EthereumService';
import WalletStorageInstance from '../services/WalletStorage';

const ImportWalletScreen = () => {
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAndImport = async () => {
    if (!mnemonic.trim()) {
      Alert.alert('Error', 'Please enter your recovery phrase');
      return;
    }
    setIsLoading(true);
    try {
      const cleanedMnemonic = mnemonic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

      if (!ethers.Mnemonic.isValidMnemonic(cleanedMnemonic)) {
        throw new Error('Invalid recovery phrase. Please check your words.');
      }
      const path = "m/44'/60'/0'/0/0";
      const wallet = ethers.HDNodeWallet.fromPhrase(cleanedMnemonic, path);
      await WalletStorageInstance.saveMnemonic(cleanedMnemonic);
      EthereumServiceInstance.initializeWallet(cleanedMnemonic);
      navigation.reset({
        index: 0,
        routes: [{ name: 'WalletHome' }],
      });
    } catch (error) {
      Alert.alert('Import Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const useTestMnemonic = () => {
    setMnemonic(
      'test test test test test test test test test test test test junk',
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Import Wallet</Text>
          <Text style={styles.subtitle}>
            Enter your 12 or 24-word recovery phrase to restore your wallet
          </Text>
        </View>

        <TextInput
          style={styles.mnemonicInput}
          value={mnemonic}
          onChangeText={setMnemonic}
          placeholder="Enter your recovery phrase separated by spaces"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.testButton} onPress={useTestMnemonic}>
          <Text style={styles.testButtonText}>Use Test Mnemonic</Text>
        </TouchableOpacity>

        <View style={styles.importContainer}>
          <TouchableOpacity
            style={[
              styles.importButton,
              isLoading && styles.importButtonDisabled,
            ]}
            onPress={validateAndImport}
            disabled={isLoading}
          >
            <Text style={styles.importButtonText}>
              {isLoading ? 'Importing...' : 'Import Wallet'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Note:</Text>
          <Text style={styles.noteText}>
            • Use the test mnemonic for development testing{'\n'}• Expected
            address: 0xf39Fd6e51aad88F6F4ce6aB8827279cfffb92266{'\n'}• Make sure
            all words are spelled correctly
          </Text>
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
  mnemonicInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  testButton: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  testButtonText: {
    color: '#3375BB',
    fontSize: 16,
    fontWeight: '500',
  },
  importContainer: {
    marginBottom: 30,
  },
  importButton: {
    backgroundColor: '#3375BB',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  importButtonDisabled: {
    backgroundColor: '#ccc',
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default ImportWalletScreen;
