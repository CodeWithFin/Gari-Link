import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ServicesScreenNavigationProp } from '../../types/navigation';
import { ServiceProviderService } from '../../services/ServiceProviderService';
import Card from '../../components/Card';

const MapViewScreenFallback: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Service Providers</Text>
      </View>
      
      <View style={styles.infoCard}>
        <Card>
          <View style={styles.infoContent}>
            <Ionicons name="alert-circle" size={24} color={theme.colors.warning} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              Map view is currently unavailable. Please make sure you have the Google Maps API configured properly.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('ServicesList')}
          >
            <Text style={styles.buttonText}>View List Instead</Text>
          </TouchableOpacity>
        </Card>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Popular Service Providers
        </Text>
        
        {/* You can add a list of service providers here without the map */}
        <View style={styles.serviceProviderList}>
          {/* This would be populated with service providers */}
          <Card style={styles.serviceProviderCard}>
            <Text style={[styles.providerName, { color: theme.colors.text }]}>
              Sample Mechanic Shop
            </Text>
            <Text style={[styles.providerInfo, { color: theme.colors.textSecondary }]}>
              123 Main Street, Nairobi
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={theme.colors.warning} />
              <Text style={{ color: theme.colors.text, marginLeft: 4 }}>4.5 (120 reviews)</Text>
            </View>
            <TouchableOpacity
              style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('ServiceDetails', { serviceId: "sample-id" })}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoCard: {
    margin: 16,
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  serviceProviderList: {
    marginBottom: 20,
  },
  serviceProviderCard: {
    padding: 16,
    marginBottom: 16,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
});

export default MapViewScreenFallback;
