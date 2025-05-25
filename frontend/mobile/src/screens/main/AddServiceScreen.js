import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SIZES } from '../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddServiceScreen = ({ route, navigation }) => {
  const { vehicleId } = route.params || {};
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  
  // Form state
  const [serviceType, setServiceType] = useState('oil_change');
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mileage, setMileage] = useState('');
  const [cost, setCost] = useState('');
  const [providerName, setProviderName] = useState('');
  const [notes, setNotes] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicleId) {
      loadVehicleData();
    } else {
      setLoadingVehicle(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    // Set default service title based on service type
    const serviceTitles = {
      oil_change: 'Oil Change & Filter',
      tire_rotation: 'Tire Rotation & Balance',
      brake_service: 'Brake Service',
      inspection: 'Vehicle Inspection',
      repair: 'Repair Service',
      other: 'Maintenance Service'
    };
    
    setServiceTitle(serviceTitles[serviceType] || 'Maintenance Service');
  }, [serviceType]);

  const loadVehicleData = async () => {
    try {
      const response = await authAxios.get(`/vehicles/${vehicleId}`);
      const vehicleData = response.data.data.vehicle;
      setVehicle(vehicleData);
      
      // Pre-fill mileage with current vehicle mileage
      if (vehicleData.mileage && vehicleData.mileage.current) {
        setMileage(vehicleData.mileage.current.toString());
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      Alert.alert(
        'Error',
        'Failed to load vehicle data. Please try again.'
      );
    } finally {
      setLoadingVehicle(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!serviceTitle.trim()) {
      newErrors.serviceTitle = 'Service title is required';
    }

    if (!mileage.trim()) {
      newErrors.mileage = 'Mileage is required';
    } else if (isNaN(mileage) || parseInt(mileage) < 0) {
      newErrors.mileage = 'Please enter a valid mileage';
    }

    if (!cost.trim()) {
      newErrors.cost = 'Cost is required';
    } else if (isNaN(cost) || parseFloat(cost) < 0) {
      newErrors.cost = 'Please enter a valid cost';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveRecord = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        type: serviceType,
        title: serviceTitle,
        description: notes,
        mileage: parseInt(mileage),
        date: serviceDate,
        cost: {
          amount: parseFloat(cost),
          currency: 'USD'
        },
        status: 'completed'
      };

      if (providerName) {
        serviceData.serviceProvider = {
          name: providerName
        };
      }

      const response = await authAxios.post(`/maintenance/${vehicleId}`, serviceData);

      if (response.status === 201) {
        Alert.alert(
          'Success',
          'Service record saved successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('ServiceHistory', { vehicleId }) 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error saving service record:', error);
      Alert.alert(
        'Error',
        'Failed to save service record. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setServiceDate(selectedDate);
    }
  };

  if (loadingVehicle) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading vehicle data...</Text>
      </View>
    );
  }

  if (!vehicle && vehicleId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Service Record</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Icon name="car-off" size={80} color={COLORS.gray} />
          <Text style={styles.errorTitle}>Vehicle Not Found</Text>
          <Text style={styles.errorText}>
            We couldn't find this vehicle. It may have been removed or you may not have permission to view it.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Service Record</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.vehicleInfoContainer}>
            <Text style={styles.vehicleInfoTitle}>
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.nickname ? ` (${vehicle.nickname})` : ''}` : 'Select Vehicle'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Service Type:</Text>
            <View style={styles.serviceTypeContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'oil_change' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('oil_change')}
                >
                  <Icon 
                    name="oil" 
                    size={24} 
                    color={serviceType === 'oil_change' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'oil_change' && styles.serviceTypeTextActive
                    ]}
                  >
                    Oil Change
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'tire_rotation' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('tire_rotation')}
                >
                  <Icon 
                    name="tire" 
                    size={24} 
                    color={serviceType === 'tire_rotation' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'tire_rotation' && styles.serviceTypeTextActive
                    ]}
                  >
                    Tire Rotation
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'brake_service' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('brake_service')}
                >
                  <Icon 
                    name="car-brake-abs" 
                    size={24} 
                    color={serviceType === 'brake_service' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'brake_service' && styles.serviceTypeTextActive
                    ]}
                  >
                    Brake Service
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'inspection' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('inspection')}
                >
                  <Icon 
                    name="magnify" 
                    size={24} 
                    color={serviceType === 'inspection' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'inspection' && styles.serviceTypeTextActive
                    ]}
                  >
                    Inspection
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'repair' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('repair')}
                >
                  <Icon 
                    name="wrench" 
                    size={24} 
                    color={serviceType === 'repair' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'repair' && styles.serviceTypeTextActive
                    ]}
                  >
                    Repair
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.serviceTypeButton,
                    serviceType === 'other' && styles.serviceTypeButtonActive
                  ]}
                  onPress={() => setServiceType('other')}
                >
                  <Icon 
                    name="tools" 
                    size={24} 
                    color={serviceType === 'other' ? COLORS.white : COLORS.primary} 
                  />
                  <Text 
                    style={[
                      styles.serviceTypeText,
                      serviceType === 'other' && styles.serviceTypeTextActive
                    ]}
                  >
                    Other
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Service Title:</Text>
              <TextInput
                style={[styles.input, errors.serviceTitle && styles.inputError]}
                value={serviceTitle}
                onChangeText={setServiceTitle}
                placeholder="e.g. Oil Change & Filter"
              />
              {errors.serviceTitle && (
                <Text style={styles.errorText}>{errors.serviceTitle}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Service Date:</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {serviceDate.toLocaleDateString()}
                </Text>
                <Icon name="calendar" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={serviceDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Odometer Reading (miles):</Text>
              <TextInput
                style={[styles.input, errors.mileage && styles.inputError]}
                value={mileage}
                onChangeText={setMileage}
                placeholder="Enter current mileage"
                keyboardType="numeric"
              />
              {errors.mileage && (
                <Text style={styles.errorText}>{errors.mileage}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Cost ($):</Text>
              <TextInput
                style={[styles.input, errors.cost && styles.inputError]}
                value={cost}
                onChangeText={setCost}
                placeholder="Enter service cost"
                keyboardType="numeric"
              />
              {errors.cost && (
                <Text style={styles.errorText}>{errors.cost}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Service Provider:</Text>
              <TextInput
                style={styles.input}
                value={providerName}
                onChangeText={setProviderName}
                placeholder="Enter service provider name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Notes:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveRecord}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveButtonText}>Save Record</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  backButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  vehicleInfoContainer: {
    padding: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  vehicleInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  formContainer: {
    padding: SIZES.padding,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 8,
  },
  serviceTypeContainer: {
    marginBottom: 20,
  },
  serviceTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    minWidth: 120,
  },
  serviceTypeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  serviceTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 5,
  },
  serviceTypeTextActive: {
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  saveButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  errorButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddServiceScreen;
