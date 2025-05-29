import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { VehicleScreenNavigationProp } from '../../types/navigation';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { VehicleService } from '../../services/VehicleService';
import { Vehicle } from '../../types/models';

// List of common car makes for dropdown selection
const CAR_MAKES = [
  'Toyota', 'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Subaru', 'Isuzu', 
  'Mercedes-Benz', 'BMW', 'Volkswagen', 'Ford', 'Hyundai', 'Kia', 'Suzuki',
  'Land Rover', 'Jeep', 'Peugeot', 'Renault', 'Other'
];

const CURRENT_YEAR = new Date().getFullYear();
const VALID_YEARS = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 }, 
  (_, i) => (CURRENT_YEAR - i).toString()
);

const AddVehicleScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    currentMileage: '',
    licensePlate: '',
    color: '',
    engineType: '',
    transmission: '',
  });
  
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMakeDropdown, setShowMakeDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.make) {
      newErrors.make = 'Make is required';
    }
    
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }
    
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Year must be a 4-digit number';
    }
    
    if (!formData.currentMileage) {
      newErrors.currentMileage = 'Current mileage is required';
    } else if (!/^\d+$/.test(formData.currentMileage)) {
      newErrors.currentMileage = 'Mileage must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSelectMake = (make: string) => {
    handleChange('make', make);
    setShowMakeDropdown(false);
  };

  const handleSelectYear = (year: string) => {
    handleChange('year', year);
    setShowYearDropdown(false);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'We need camera roll permission to upload vehicle photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVehicleImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You need to be signed in to add a vehicle');
      return;
    }
    
    if (!validateForm()) {
      Alert.alert('Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newVehicle: Omit<Vehicle, 'id'> = {
        userId: user.id,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        currentMileage: parseInt(formData.currentMileage),
        licensePlate: formData.licensePlate || undefined,
        color: formData.color || undefined,
        engineType: formData.engineType || undefined,
        transmission: formData.transmission as 'Manual' | 'Automatic' | undefined,
        image: vehicleImage || undefined,
      };
      
      await VehicleService.addVehicle(newVehicle);
      
      Alert.alert(
        'Success',
        'Vehicle added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VehicleList'),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding vehicle:', error);
      Alert.alert('Error', 'Failed to add vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Add a New Vehicle
        </Text>
        
        {/* Vehicle Image */}
        <TouchableOpacity
          style={[
            styles.imageContainer,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
          ]}
          onPress={handleImagePick}
          accessibilityLabel="Add vehicle image"
        >
          {vehicleImage ? (
            <Image source={{ uri: vehicleImage }} style={styles.vehicleImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="car-outline" size={64} color={theme.colors.text} />
              <Text style={[styles.imagePlaceholderText, { color: theme.colors.text }]}>
                Tap to add vehicle photo
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Vehicle Information Form */}
        <View style={styles.formContainer}>
          {/* Make Field with Dropdown */}
          <View style={styles.dropdownContainer}>
            <InputField
              label="Make"
              value={formData.make}
              onChangeText={(value) => handleChange('make', value)}
              onBlur={() => handleBlur('make')}
              placeholder="e.g., Toyota"
              error={errors.make}
              touched={touched.make}
              required
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowMakeDropdown(!showMakeDropdown)}
                  accessibilityLabel="Select car make"
                >
                  <Ionicons 
                    name={showMakeDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
              }
            />
            {showMakeDropdown && (
              <View style={[
                styles.dropdown, 
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
              ]}>
                <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                  {CAR_MAKES.map((make) => (
                    <TouchableOpacity
                      key={make}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectMake(make)}
                    >
                      <Text style={{ color: theme.colors.text }}>{make}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          
          <InputField
            label="Model"
            value={formData.model}
            onChangeText={(value) => handleChange('model', value)}
            onBlur={() => handleBlur('model')}
            placeholder="e.g., Corolla"
            error={errors.model}
            touched={touched.model}
            required
          />
          
          {/* Year Field with Dropdown */}
          <View style={styles.dropdownContainer}>
            <InputField
              label="Year"
              value={formData.year}
              onChangeText={(value) => handleChange('year', value)}
              onBlur={() => handleBlur('year')}
              placeholder="e.g., 2018"
              keyboardType="numeric"
              error={errors.year}
              touched={touched.year}
              required
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowYearDropdown(!showYearDropdown)}
                  accessibilityLabel="Select year"
                >
                  <Ionicons 
                    name={showYearDropdown ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={theme.colors.text} 
                  />
                </TouchableOpacity>
              }
            />
            {showYearDropdown && (
              <View style={[
                styles.dropdown, 
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
              ]}>
                <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                  {VALID_YEARS.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={styles.dropdownItem}
                      onPress={() => handleSelectYear(year)}
                    >
                      <Text style={{ color: theme.colors.text }}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
          
          <InputField
            label="Current Mileage (km)"
            value={formData.currentMileage}
            onChangeText={(value) => handleChange('currentMileage', value)}
            onBlur={() => handleBlur('currentMileage')}
            placeholder="e.g., 50000"
            keyboardType="numeric"
            error={errors.currentMileage}
            touched={touched.currentMileage}
            required
          />
          
          <InputField
            label="License Plate"
            value={formData.licensePlate}
            onChangeText={(value) => handleChange('licensePlate', value)}
            placeholder="e.g., KBZ 123A"
          />
          
          <InputField
            label="Color"
            value={formData.color}
            onChangeText={(value) => handleChange('color', value)}
            placeholder="e.g., Silver"
          />
          
          <InputField
            label="Engine Type"
            value={formData.engineType}
            onChangeText={(value) => handleChange('engineType', value)}
            placeholder="e.g., 1.8L Petrol"
          />
          
          <View style={styles.radioContainer}>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>
              Transmission
            </Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChange('transmission', 'Automatic')}
                accessibilityLabel="Automatic transmission"
              >
                <View style={[
                  styles.radioButton,
                  { borderColor: theme.colors.primary },
                  formData.transmission === 'Automatic' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]} />
                <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                  Automatic
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChange('transmission', 'Manual')}
                accessibilityLabel="Manual transmission"
              >
                <View style={[
                  styles.radioButton,
                  { borderColor: theme.colors.primary },
                  formData.transmission === 'Manual' && {
                    backgroundColor: theme.colors.primary,
                  },
                ]} />
                <Text style={{ color: theme.colors.text, marginLeft: 8 }}>
                  Manual
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Button
            title="Add Vehicle"
            onPress={handleSubmit}
            type="primary"
            isLoading={isSubmitting}
            style={styles.submitButton}
            accessibilityLabel="Add vehicle button"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 2,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
    marginBottom: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddVehicleScreen;
