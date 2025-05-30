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
  Switch,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { VehicleScreenNavigationProp, VehicleStackParamList } from '../../types/navigation';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { ReminderService } from '../../services/ReminderService';
import { Vehicle, Reminder } from '../../types/models';
import { VehicleService } from '../../services/VehicleService';
import { formatDate } from '../../utils/helpers';

// Common service types for dropdown selection
const SERVICE_TYPES = [
  'Oil Change', 'Tire Rotation', 'Brake Service', 'Air Filter', 'Battery Replacement',
  'Transmission Service', 'Coolant Flush', 'Fuel Filter', 'Spark Plugs', 'Timing Belt',
  'Wheel Alignment', 'Suspension Service', 'Insurance Renewal', 'Vehicle Inspection',
  'Other'
];

// Priority options
const PRIORITY_OPTIONS: Array<Reminder['priority']> = ['Low', 'Medium', 'High'];

// Recurrence interval options
const RECURRENCE_INTERVALS = [
  { value: 30, label: '1 Month' },
  { value: 90, label: '3 Months' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' },
  { value: 5000, label: '5,000 KM' },
  { value: 10000, label: '10,000 KM' },
];

type AddReminderScreenRouteProp = RouteProp<
  VehicleStackParamList, 
  'AddReminder'
>;

const AddReminderScreen: React.FC = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<AddReminderScreenRouteProp>();
  const { vehicleId } = route.params;
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<{
    serviceType: string;
    description: string;
    targetDate: Date | null;
    targetMileage: string;
    priority: Reminder['priority'];
    enableRecurrence: boolean;
    recurrenceInterval: number;
    recurrenceUnit: Reminder['recurrence']['unit'];
  }>({
    serviceType: '',
    description: '',
    targetDate: new Date(),
    targetMileage: '',
    priority: 'Medium',
    enableRecurrence: false,
    recurrenceInterval: 30,
    recurrenceUnit: 'Days',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServiceTypeDropdown, setShowServiceTypeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showRecurrenceDropdown, setShowRecurrenceDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderType, setReminderType] = useState<'date' | 'mileage'>('date');

  // Fetch vehicle data on mount
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const vehicleData = await VehicleService.getVehicleById(vehicleId);
        if (vehicleData) {
          setVehicle(vehicleData);
        } else {
          showToast({
            message: 'Vehicle not found',
            type: 'error',
            position: 'top',
            duration: 3000
          });
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading vehicle:', error);
        showToast({
          message: 'Failed to load vehicle data',
          type: 'error',
          position: 'top',
          duration: 3000
        });
      }
    };

    loadVehicle();
  }, [vehicleId, navigation, showToast]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    
    if (reminderType === 'date' && !formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    }
    
    if (reminderType === 'mileage') {
      if (!formData.targetMileage) {
        newErrors.targetMileage = 'Target mileage is required';
      } else if (!/^\d+$/.test(formData.targetMileage)) {
        newErrors.targetMileage = 'Mileage must be a number';
      } else if (vehicle && parseInt(formData.targetMileage) <= vehicle.currentMileage) {
        newErrors.targetMileage = 'Target mileage must be greater than current mileage';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleReminderTypeChange = (type: 'date' | 'mileage') => {
    setReminderType(type);
    if (type === 'date') {
      setFormData({ ...formData, targetMileage: '' });
    } else {
      setFormData({ ...formData, targetDate: null });
    }
  };

  const handleSelectServiceType = (serviceType: string) => {
    handleChange('serviceType', serviceType);
    setShowServiceTypeDropdown(false);
  };

  const handleSelectPriority = (priority: Reminder['priority']) => {
    handleChange('priority', priority);
    setShowPriorityDropdown(false);
  };

  const handleSelectRecurrence = (interval: number, unit: Reminder['recurrence']['unit']) => {
    handleChange('recurrenceInterval', interval);
    handleChange('recurrenceUnit', unit);
    setShowRecurrenceDropdown(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('targetDate', selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Please correct the errors in the form',
        type: 'error',
        position: 'top',
        duration: 3000
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newReminder: Omit<Reminder, 'id'> = {
        vehicleId,
        serviceType: formData.serviceType,
        description: formData.description || undefined,
        targetDate: reminderType === 'date' ? formData.targetDate! : undefined,
        targetMileage: reminderType === 'mileage' ? parseInt(formData.targetMileage) : undefined,
        isCompleted: false,
        reminderSent: false,
        priority: formData.priority,
        recurrence: formData.enableRecurrence 
          ? {
              interval: formData.recurrenceInterval,
              unit: formData.recurrenceUnit,
            }
          : undefined,
      };
      
      await ReminderService.addReminder(newReminder);
      
      showToast({
        message: 'Reminder added successfully',
        type: 'success',
        position: 'top',
        duration: 3000
      });
      
      // Navigate back to vehicle details after a short delay
      setTimeout(() => {
        navigation.navigate('VehicleDetails', { vehicleId });
      }, 1000);
    } catch (error) {
      console.error('Error adding reminder:', error);
      showToast({
        message: 'Failed to add reminder. Please try again.',
        type: 'error',
        position: 'top',
        duration: 3000
      });
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
          Add Service Reminder
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
                {SERVICE_TYPES.map((type) => (
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
          label="Description (Optional)"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Additional details about the service"
          multiline
          numberOfLines={3}
        />
        
        {/* Reminder Type Selection */}
        <View style={styles.segmentContainer}>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Reminder Type</Text>
          <View style={styles.segmentControl}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                reminderType === 'date' && { 
                  backgroundColor: theme.colors.primary 
                },
                { borderColor: theme.colors.border }
              ]}
              onPress={() => handleReminderTypeChange('date')}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  { color: reminderType === 'date' ? theme.colors.white : theme.colors.text }
                ]}
              >
                By Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                reminderType === 'mileage' && { 
                  backgroundColor: theme.colors.primary 
                },
                { borderColor: theme.colors.border }
              ]}
              onPress={() => handleReminderTypeChange('mileage')}
            >
              <Text 
                style={[
                  styles.segmentText, 
                  { color: reminderType === 'mileage' ? theme.colors.white : theme.colors.text }
                ]}
              >
                By Mileage
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Date Picker (conditional) */}
        {reminderType === 'date' && (
          <View style={styles.dateContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Target Date
            </Text>
            <TouchableOpacity
              style={[
                styles.dateButton, 
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: theme.colors.text }}>
                {formData.targetDate ? formatDate(formData.targetDate) : 'Select date'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.targetDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
            {errors.targetDate && touched.targetDate && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.targetDate}
              </Text>
            )}
          </View>
        )}
        
        {/* Target Mileage (conditional) */}
        {reminderType === 'mileage' && (
          <InputField
            label="Target Mileage"
            value={formData.targetMileage}
            onChangeText={(value) => handleChange('targetMileage', value)}
            onBlur={() => handleBlur('targetMileage')}
            placeholder={`Current: ${vehicle?.currentMileage || 0} km`}
            keyboardType="numeric"
            error={errors.targetMileage}
            touched={touched.targetMileage}
            required
          />
        )}
        
        {/* Priority Selection */}
        <View style={styles.dropdownContainer}>
          <InputField
            label="Priority"
            value={formData.priority}
            onChangeText={(value) => {}}
            placeholder="Select priority"
            error={errors.priority}
            touched={touched.priority}
            editable={false}
            rightIcon={
              <TouchableOpacity
                onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
                accessibilityLabel="Select priority"
              >
                <Ionicons 
                  name={showPriorityDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={theme.colors.text} 
                />
              </TouchableOpacity>
            }
          />
          {showPriorityDropdown && (
            <View style={[
              styles.dropdown, 
              styles.smallDropdown,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
            ]}>
              {PRIORITY_OPTIONS.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectPriority(priority)}
                >
                  <View style={styles.priorityOption}>
                    <View 
                      style={[
                        styles.priorityDot, 
                        { 
                          backgroundColor: 
                            priority === 'High' ? theme.colors.error : 
                            priority === 'Medium' ? theme.colors.warning : 
                            theme.colors.success 
                        }
                      ]} 
                    />
                    <Text style={{ color: theme.colors.text }}>{priority}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        
        {/* Recurrence Options */}
        <View style={styles.recurrenceContainer}>
          <View style={styles.recurrenceToggle}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Recurring Reminder
            </Text>
            <Switch
              value={formData.enableRecurrence}
              onValueChange={(value) => handleChange('enableRecurrence', value)}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={formData.enableRecurrence ? theme.colors.card : '#f4f3f4'}
            />
          </View>
          
          {formData.enableRecurrence && (
            <View style={styles.dropdownContainer}>
              <InputField
                label="Repeat Every"
                value={
                  formData.recurrenceUnit === 'KM' 
                    ? `${formData.recurrenceInterval} KM` 
                    : RECURRENCE_INTERVALS.find(item => item.value === formData.recurrenceInterval)?.label || ''
                }
                onChangeText={() => {}}
                placeholder="Select interval"
                editable={false}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowRecurrenceDropdown(!showRecurrenceDropdown)}
                    accessibilityLabel="Select recurrence interval"
                  >
                    <Ionicons 
                      name={showRecurrenceDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color={theme.colors.text} 
                    />
                  </TouchableOpacity>
                }
              />
              {showRecurrenceDropdown && (
                <View style={[
                  styles.dropdown, 
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
                ]}>
                  <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                    {RECURRENCE_INTERVALS.map((interval) => (
                      <TouchableOpacity
                        key={interval.label}
                        style={styles.dropdownItem}
                        onPress={() => {
                          const unit: Reminder['recurrence']['unit'] = interval.label.includes('KM') ? 'KM' : 'Days';
                          handleSelectRecurrence(interval.value, unit);
                        }}
                      >
                        <Text style={{ color: theme.colors.text }}>{interval.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </View>
        
        <Button
          title="Save Reminder"
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  segmentContainer: {
    marginBottom: 16,
  },
  segmentControl: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  segmentText: {
    fontWeight: '500',
  },
  dateContainer: {
    marginBottom: 16,
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
  smallDropdown: {
    maxHeight: 150,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  recurrenceContainer: {
    marginBottom: 16,
  },
  recurrenceToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddReminderScreen;
