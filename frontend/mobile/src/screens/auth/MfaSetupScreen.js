import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { COLORS, SIZES } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const MfaSetupScreen = ({ navigation }) => {
  const { setupMfa } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('app');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    try {
      const result = await setupMfa(selectedMethod);
      
      if (result.success) {
        // If setup was successful, navigate to the verification screen
        navigation.navigate('MfaVerify', { 
          method: selectedMethod,
          secret: result.data?.secret,
          setupMode: true
        });
      } else {
        Alert.alert('Setup Failed', result.message || 'Failed to setup MFA. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip MFA setup and go to add vehicle screen
    navigation.navigate('AddVehicle');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Security Verification</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.description}>
            Protect your account with two-factor authentication
          </Text>

          <Text style={styles.sectionTitle}>
            Choose your verification method:
          </Text>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === 'app' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('app')}
          >
            <View style={styles.radioButton}>
              {selectedMethod === 'app' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Authenticator App (Recommended)</Text>
              <Text style={styles.methodDescription}>
                Use Google Authenticator or similar
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === 'sms' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('sms')}
          >
            <View style={styles.radioButton}>
              {selectedMethod === 'sms' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>SMS Authentication</Text>
              <Text style={styles.methodDescription}>
                Receive codes via text message
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === 'email' && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod('email')}
          >
            <View style={styles.radioButton}>
              {selectedMethod === 'email' && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.methodDetails}>
              <Text style={styles.methodTitle}>Email Authentication</Text>
              <Text style={styles.methodDescription}>
                Receive codes via email
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Setting up...' : 'Continue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>
              Skip for now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  contentContainer: {
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    marginBottom: 15,
  },
  selectedMethod: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(44, 107, 237, 0.05)',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  methodDetails: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  methodDescription: {
    fontSize: 14,
    color: COLORS.gray,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipButton: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
  },
  skipButtonText: {
    color: COLORS.gray,
    fontSize: 16,
  },
});

export default MfaSetupScreen;
