import React, { useState, useEffect } from 'react';
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
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { VehicleScreenNavigationProp, VehicleStackParamList } from '../../types/navigation';
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

type EditVehicleScreenRouteProp = RouteProp<
  VehicleStackParamList, 
  'EditVehicle'
>;

const EditVehicleScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<EditVehicleScreenRouteProp>();
  const { vehicleId } = route.params;
  
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
  const [isLoading, setIsLoading] = useState(true);
  const [originalVehicle, setOriginalVehicle] = useState<Vehicle | null>(null);

  // Fetch vehicle data on mount
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setIsLoading(true);
        const vehicleData = await VehicleService.getVehicleById(vehicleId);
        if (vehicleData) {
          setOriginalVehicle(vehicleData);
          setFormData({
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year.toString(),
            currentMileage: vehicleData.currentMileage.toString(),
            licensePlate: vehicleData.licensePlate || '',
            color: vehicleData.color || '',
            engineType: vehicleData.engineType || '',
            transmission: vehicleData.transmission || '',
          });
          setVehicleImage(vehicleData.image || null);
        } else {
          Alert.alert('Error', 'Vehicle not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading vehicle:', error);
        Alert.alert('Error', 'Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [vehicleId, navigation]);

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
    if (!originalVehicle) {
      Alert.alert('Error', 'Vehicle data not loaded');
      return;
    }
    
    if (!validateForm()) {
      Alert.alert('Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const updatedVehicle: Vehicle = {
        ...originalVehicle,
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
      
      await VehicleService.updateVehicle(updatedVehicle);
      
      Alert.alert(
        'Success',
        'Vehicle updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VehicleDetails', { vehicleId }),
          },
        ]
      );
    } catch (error) {
      console.error('Error updating vehicle:', error);
      Alert.alert('Error', 'Failed to update vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              await VehicleService.deleteVehicle(vehicleId);
              Alert.alert('Success', 'Vehicle deleted successfully');
              navigation.navigate('VehicleList');
            } catch (error) {
              console.error('Error deleting vehicle:', error);
              Alert.alert('Error', 'Failed to delete vehicle');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading vehicle data...</Text>
      </View>
    );
  }

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
          Edit Vehicle
        </Text>
        
        {/* Vehicle Image */}
        <TouchableOpacity
          style={[
            styles.imageContainer,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
          ]}
          onPress={handleImagePick}
          accessibilityLabel="Edit vehicle image"
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
            placeholder="e.g., 45000"
            keyboardType="numeric"
            error={errors.currentMileage}
            touched={touched.currentMileage}
            required
          />
          
          <InputField
            label="License Plate"
            value={formData.licensePlate}
            onChangeText={(value) => handleChange('licensePlate', value)}
            onBlur={() => handleBlur('licensePlate')}
            placeholder="e.g., KCB 123Z"
            error={errors.licensePlate}
            touched={touched.licensePlate}
          />
          
          <InputField
            label="Color"
            value={formData.color}
            onChangeText={(value) => handleChange('color', value)}
            onBlur={() => handleBlur('color')}
            placeholder="e.g., Silver"
            error={errors.color}
            touched={touched.color}
          />
          
          <InputField
            label="Engine Type"
            value={formData.engineType}
            onChangeText={(value) => handleChange('engineType', value)}
            onBlur={() => handleBlur('engineType')}
            placeholder="e.g., 1.8L Petrol"
            error={errors.engineType}
            touched={touched.engineType}
          />
          
          {/* Transmission Type Radio Buttons */}
          <View style={styles.radioContainer}>
            <Text style={[styles.radioLabel, { color: theme.colors.text }]}>Transmission</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChange('transmission', 'Manual')}
                accessibilityLabel="Manual transmission"
              >
                <View 
                  style={[
                    styles.radioButton, 
                    { 
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.background 
                    }
                  ]}
                >
                  {formData.transmission === 'Manual' && (
                    <View 
                      style={[
                        styles.radioButtonSelected, 
                        { backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  )}
                </View>
                <Text style={{ marginLeft: 8, color: theme.colors.text }}>Manual</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleChange('transmission', 'Automatic')}
                accessibilityLabel="Automatic transmission"
              >
                <View 
                  style={[
                    styles.radioButton, 
                    { 
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.background 
                    }
                  ]}
                >
                  {formData.transmission === 'Automatic' && (
                    <View 
                      style={[
                        styles.radioButtonSelected, 
                        { backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  )}
                </View>
                <Text style={{ marginLeft: 8, color: theme.colors.text }}>Automatic</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <Button
          title="Update Vehicle"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        
        <Button
          title="Delete Vehicle"
          onPress={handleDelete}
          style={styles.deleteButton}
          type="danger"
          disabled={isSubmitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 12,
  },
});

export default EditVehicleScreen;
