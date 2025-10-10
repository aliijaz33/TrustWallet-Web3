import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import WalletStorageInstance from '../services/WalletStorage';
import Clipboard from '@react-native-clipboard/clipboard';
const SettingsScreen = () => {
  const navigation = useNavigation();
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [copyMnemonicFeedback, setCopyMnemonicFeedback] = useState('');
  const [revealClicked, setRevealClicked] = useState(true);

  const handleBackupWallet = async () => {
    try {
      const storedMnemonic = await WalletStorageInstance.getMnemonic();
      if (storedMnemonic) {
        setMnemonic(storedMnemonic);
        setShowBackupModal(true);
      } else {
        Alert.alert('Error', 'No wallet found to backup');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve recovery phrase');
    }
  };

  const handleResetWallet = () => {
    Alert.alert(
      'Reset Wallet',
      'This will permanently delete your wallet and all data. Make sure you have backed up your recovery phrase!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Wallet',
          style: 'destructive',
          onPress: async () => {
            try {
              await WalletStorageInstance.deleteWallet();
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

  const handleCloseBackup = () => {
    setShowBackupModal(false);
    setMnemonic('');
    setRevealClicked(true);
  };
  const handleRevealClicked = () => {
    setRevealClicked(false);
  };

  const handleCopyMnemonic = async () => {
    try {
      await Clipboard.setString(mnemonic);
      setCopyMnemonicFeedback('✓ Copied!');
      setTimeout(() => {
        setCopyMnemonicFeedback('');
      }, 3000);
    } catch (error) {
      console.error('Failed to copy mnemonic:', error);
      setCopyMnemonicFeedback('❌ Failed');
      setTimeout(() => {
        setCopyMnemonicFeedback('');
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#3375BB" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity style={styles.option} onPress={handleBackupWallet}>
            <View style={styles.optionLeft}>
              <Icon name="key-outline" size={22} color="#3375BB" />
              <Text style={styles.optionText}>Backup Recovery Phrase</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={handleResetWallet}>
            <View style={styles.optionLeft}>
              <Icon name="trash-outline" size={22} color="#dc3545" />
              <Text style={[styles.optionText, styles.dangerText]}>
                Reset Wallet
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.option}>
            <View style={styles.optionLeft}>
              <Icon
                name="information-circle-outline"
                size={22}
                color="#3375BB"
              />
              <Text style={styles.optionText}>Version</Text>
            </View>
            <Text style={styles.optionValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showBackupModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseBackup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Recovery Phrase</Text>
            <Text style={styles.modalWarning}>
              ⚠️ Never share your recovery phrase! Anyone with these words can
              access your funds.
            </Text>
            {revealClicked ? (
              <TouchableOpacity
                style={styles.revealContainer}
                onPress={handleRevealClicked}
              >
                <Text style={styles.revealText}>Click to reveal</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.mnemonicContainer}>
                {mnemonic.split(' ').map((word, index) => (
                  <View key={index} style={styles.wordContainer}>
                    <Text style={styles.wordNumber}>{index + 1}.</Text>
                    <Text style={styles.word}>{word}</Text>
                  </View>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopyMnemonic}
            >
              <Text style={styles.buttonText}>
                {copyMnemonicFeedback || 'Copy Recovery Phrase'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={handleCloseBackup}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  dangerText: {
    color: '#dc3545',
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
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
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalWarning: {
    fontSize: 14,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  revealContainer: {
    backgroundColor: 'rgba(150,150,150,0.5)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '95%',
    height: 250,
    marginBottom: 20,
    alignSelf: 'center',
  },
  revealText: {
    color: 'black',
    fontSize: 18,
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
  button: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#3375BB',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyFeedbackText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsScreen;
