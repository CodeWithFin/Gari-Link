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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { VehicleScreenNavigationProp, VehicleStackParamList } from '../../types/navigation';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { MaintenanceService } from '../../services/MaintenanceService';
import { MaintenanceRecord, Vehicle } from '../../types/models';
import { VehicleService } from '../../services/VehicleService';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Common maintenance types for dropdown selection
const MAINTENANCE_TYPES = [
  'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter', 'Battery Replacement',
  'Transmission Service', 'Coolant Flush', 'Fuel Filter', 'Spark Plugs', 'Timing Belt',
  'Wheel Alignment', 'Suspension Service', 'Engine Tuning', 'Bodywork', 'Other'
];

type AddMaintenanceRecordScreenRouteProp = RouteProp<
  VehicleStackParamList, 
  'AddMaintenanceRecord'
>;

const AddMaintenanceRecordScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<AddMaintenanceRecordScreenRouteProp>();
  const { vehicleId } = route.params;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    date: new Date(),
    mileage: '',
    serviceType: '',
    description: '',
    cost: '',
    location: '',
    performedBy: '',
    notes: '',
  });
  
  const [receiptImages, setReceiptImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch vehicle data on mount
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const vehicleData = await VehicleService.getVehicleById(vehicleId);
        if (vehicleData) {
          setVehicle(vehicleData);
          // Pre-fill mileage with current vehicle mileage
          setFormData(prev => ({
            ...prev,
            mileage: vehicleData.currentMileage.toString(),
          }));
        } else {
          Alert.alert('Error', 'Vehicle not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading vehicle:', error);
        Alert.alert('Error', 'Failed to load vehicle data');
      }
    };

    loadVehicle();
  }, [vehicleId, navigation]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    
    if (!formData.mileage) {
      newErrors.mileage = 'Mileage is required';
    } else if (!/^\d+$/.test(formData.mileage)) {
      newErrors.mileage = 'Mileage must be a number';
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.cost)) {
      newErrors.cost = 'Cost must be a valid amount';
    }
    
    if (!formData.location) {
      newErrors.location = 'Location is required';
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

  const handleSelectServiceType = (serviceType: string) => {
    handleChange('serviceType', serviceType);
    setShowServiceTypeDropdown(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'We need camera roll permission to upload receipt photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setReceiptImages([...receiptImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...receiptImages];
    updatedImages.splice(index, 1);
    setReceiptImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please correct the errors in the form');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newRecord: Omit<MaintenanceRecord, 'id'> = {
        vehicleId,
        date: formData.date,
        mileage: parseInt(formData.mileage),
        serviceType: formData.serviceType,
        description: formData.description,
        cost: parseFloat(formData.cost),
        location: formData.location,
        performedBy: formData.performedBy || undefined,
        notes: formData.notes || undefined,
        receiptImages: receiptImages.length > 0 ? receiptImages : undefined,
      };
      
      await MaintenanceService.addMaintenanceRecord(newRecord);
      
      // Update vehicle mileage if the current record has higher mileage
      if (vehicle && parseInt(formData.mileage) > vehicle.currentMileage) {
        await VehicleService.updateVehicle({
          ...vehicle,
          currentMileage: parseInt(formData.mileage),
        });
      }
      
      Alert.alert(
        'Success',
        'Maintenance record added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('VehicleDetails', { vehicleId }),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      Alert.alert('Error', 'Failed to add maintenance record. Please try again.');
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
          Add Service Record
        </Text>
        
        {/* Vehicle Info Summary */}
        {vehicle && (
          <View style={[styles.vehicleInfo, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.vehicleInfoText, { color: theme.colors.text }]}>
              {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            </Text>
            {vehicle.licensePlate && (
              <Text style={[styles.vehicleInfoPlate, { color: theme.colors.text }]}>
                {vehicle.licensePlate}
              </Text>
            )}
          </View>
        )}
        
        {/* Service Date */}
        <View style={styles.dateContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Service Date</Text>
          <TouchableOpacity
            style={[styles.dateButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.colors.text }}>
              {formatDate(formData.date)}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
        
        {/* Service Type with Dropdown */}
        <View style={styles.dropdownContainer}>
          <InputField
            label="Service Type"
            value={formData.serviceType}
            onChangeText={(value) => handleChange('serviceType', value)}
            onBlur={() => handleBlur('serviceType')}
            placeholder="e.g., Oil Change"
            error={errors.serviceType}
            touched={touched.serviceType}
            required
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowServiceTypeDropdown(!showServiceTypeDropdown)}
                accessibilityLabel="Select service type"
              >
                <Ionicons 
                  name={showServiceTypeDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            }
          />
          {showServiceTypeDropdown && (
            <View style={[
              styles.dropdown, 
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}>
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {MAINTENANCE_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => handleSelectServiceType(type)}
                  >
                    <Text style={{ color: theme.colors.text }}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        
        <InputField
          label="Current Mileage"
          value={formData.mileage}
          onChangeText={(value) => handleChange('mileage', value)}
          onBlur={() => handleBlur('mileage')}
          placeholder="e.g., 45000"
          keyboardType="numeric"
          error={errors.mileage}
          touched={touched.mileage}
          required
        />
        
        <InputField
          label="Description"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          onBlur={() => handleBlur('description')}
          placeholder="e.g., Regular maintenance service"
          error={errors.description}
          touched={touched.description}
          multiline
          numberOfLines={3}
          required
        />
        
        <InputField
          label="Cost (KES)"
          value={formData.cost}
          onChangeText={(value) => handleChange('cost', value)}
          onBlur={() => handleBlur('cost')}
          placeholder="e.g., 5000"
          keyboardType="numeric"
          error={errors.cost}
          touched={touched.cost}
          required
        />
        
        <InputField
          label="Location"
          value={formData.location}
          onChangeText={(value) => handleChange('location', value)}
          onBlur={() => handleBlur('location')}
          placeholder="e.g., Toyota Kenya, Westlands"
          error={errors.location}
          touched={touched.location}
          required
        />
        
        <InputField
          label="Service Provider"
          value={formData.performedBy}
          onChangeText={(value) => handleChange('performedBy', value)}
          onBlur={() => handleBlur('performedBy')}
          placeholder="e.g., John Mechanic"
          error={errors.performedBy}
          touched={touched.performedBy}
        />
        
        <InputField
          label="Additional Notes"
          value={formData.notes}
          onChangeText={(value) => handleChange('notes', value)}
          onBlur={() => handleBlur('notes')}
          placeholder="Any additional notes or observations"
          multiline
          numberOfLines={4}
          error={errors.notes}
          touched={touched.notes}
        />
        
        {/* Receipt Images */}
        <View style={styles.imagesSection}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Receipt Images (Optional)</Text>
          
          <View style={styles.imagesGrid}>
            {receiptImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.receiptImage} />
                <TouchableOpacity
                  style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            
            <TouchableOpacity
              style={[
                styles.addImageButton,
                { borderColor: theme.colors.border, backgroundColor: theme.colors.card }
              ]}
              onPress={handleImagePick}
            >
              <Ionicons name="add" size={32} color={theme.colors.text} />
              <Text style={{ color: theme.colors.text, fontSize: 12, marginTop: 4 }}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          title="Save Record"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={isSubmitting}
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
  vehicleInfo: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleInfoText: {
    fontSize: 16,
    fontWeight: '500',
  },
  vehicleInfoPlate: {
    fontSize: 14,
    fontWeight: '400',
  },
  dateContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
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
  imagesSection: {
    marginVertical: 16,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 4,
    position: 'relative',
  },
  receiptImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddMaintenanceRecordScreen;
