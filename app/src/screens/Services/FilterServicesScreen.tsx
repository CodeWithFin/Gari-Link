import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../context/ThemeContext';
import { ServicesScreenNavigationProp } from '../../types/navigation';
import Button from '../../components/Button';

// This would ideally be stored in app state/context to persist filters
// Here we're just using a placeholder filter state for demonstration
const FilterServicesScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  
  // Filter states
  const [priceRange, setPriceRange] = useState<string[]>(['Budget', 'Mid-Range', 'Premium']);
  const [minRating, setMinRating] = useState(0);
  const [distance, setDistance] = useState(10); // in kilometers
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [openNow, setOpenNow] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  
  // Service types
  const serviceTypes = [
    'Oil Change',
    'Tire Services',
    'Brake Service',
    'Engine Repair',
    'Transmission',
    'Body Shop',
    'Car Wash',
    'Diagnostics',
    'Electrical',
    'Air Conditioning',
    'Wheel Alignment',
    'Suspension',
  ];
  
  // Price range options
  const priceOptions = [
    { id: 'Budget', label: 'Budget', icon: 'cash-outline' },
    { id: 'Mid-Range', label: 'Mid-Range', icon: 'cash-outline' },
    { id: 'Premium', label: 'Premium', icon: 'cash-outline' },
  ];

  const togglePriceRange = (price: string) => {
    if (priceRange.includes(price)) {
      // Don't allow removing all options
      if (priceRange.length === 1) {
        return;
      }
      setPriceRange(priceRange.filter(p => p !== price));
    } else {
      setPriceRange([...priceRange, price]);
    }
  };

  const toggleServiceType = (service: string) => {
    if (selectedServiceTypes.includes(service)) {
      setSelectedServiceTypes(selectedServiceTypes.filter(s => s !== service));
    } else {
      setSelectedServiceTypes([...selectedServiceTypes, service]);
    }
  };

  const resetFilters = () => {
    setPriceRange(['Budget', 'Mid-Range', 'Premium']);
    setMinRating(0);
    setDistance(10);
    setVerifiedOnly(false);
    setOpenNow(false);
    setSelectedServiceTypes([]);
  };

  const applyFilters = () => {
    // In a real app, you would apply these filters to your service provider query
    // and pass them to the previous screen
    Alert.alert(
      'Filters Applied',
      'In a complete implementation, these filters would be applied to your service provider search.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Price Range */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Price Range
          </Text>
          <View style={styles.priceOptions}>
            {priceOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.priceOption,
                  priceRange.includes(option.id) && { 
                    backgroundColor: theme.colors.primary + '20',
                    borderColor: theme.colors.primary,
                  },
                  !priceRange.includes(option.id) && { 
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => togglePriceRange(option.id)}
              >
                <Ionicons 
                  name={option.icon} 
                  size={18} 
                  color={
                    priceRange.includes(option.id) 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary
                  } 
                />
                <Text 
                  style={[
                    styles.priceOptionText, 
                    { 
                      color: priceRange.includes(option.id) 
                        ? theme.colors.primary 
                        : theme.colors.text 
                    }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Rating */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Minimum Rating
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((value) => (
                <TouchableOpacity
                  key={value}
                  onPress={() => setMinRating(value)}
                  style={styles.starButton}
                >
                  <Ionicons
                    name={value <= minRating ? "star" : "star-outline"}
                    size={24}
                    color={theme.colors.warning}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.ratingText, { color: theme.colors.text }]}>
              {minRating === 0 ? 'Any rating' : `${minRating}+ stars`}
            </Text>
          </View>
        </View>
        
        {/* Distance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Maximum Distance
            </Text>
            <Text style={[styles.distanceValue, { color: theme.colors.text }]}>
              {distance} km
            </Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={50}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text style={{ color: theme.colors.textSecondary }}>1 km</Text>
            <Text style={{ color: theme.colors.textSecondary }}>50 km</Text>
          </View>
        </View>
        
        {/* Switches */}
        <View style={styles.section}>
          <View style={styles.switchItem}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Verified Providers Only
            </Text>
            <Switch
              value={verifiedOnly}
              onValueChange={setVerifiedOnly}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={verifiedOnly ? theme.colors.card : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.switchItem}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Open Now
            </Text>
            <Switch
              value={openNow}
              onValueChange={setOpenNow}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={openNow ? theme.colors.card : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Service Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Service Types
          </Text>
          <View style={styles.serviceTypesGrid}>
            {serviceTypes.map((service) => (
              <TouchableOpacity
                key={service}
                style={[
                  styles.serviceTypeItem,
                  selectedServiceTypes.includes(service) && { 
                    backgroundColor: theme.colors.primary + '20',
                    borderColor: theme.colors.primary,
                  },
                  !selectedServiceTypes.includes(service) && { 
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => toggleServiceType(service)}
              >
                <Text 
                  style={[
                    styles.serviceTypeText, 
                    { 
                      color: selectedServiceTypes.includes(service) 
                        ? theme.colors.primary 
                        : theme.colors.text 
                    }
                  ]}
                >
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { borderTopColor: theme.colors.border }]}>
        <Button
          title="Reset"
          onPress={resetFilters}
          type="outline"
          style={styles.resetButton}
        />
        <Button
          title="Apply Filters"
          onPress={applyFilters}
          style={styles.applyButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  priceOptionText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    fontSize: 14,
  },
  distanceValue: {
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  switchLabel: {
    fontSize: 16,
  },
  serviceTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTypeItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  serviceTypeText: {
    fontSize: 14,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    flex: 2,
  },
});

export default FilterServicesScreen;
