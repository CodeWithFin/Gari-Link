import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ServicesScreenNavigationProp, ServicesStackParamList } from '../../types/navigation';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { ServiceProviderService } from '../../services/ServiceProviderService';
import { VehicleService } from '../../services/VehicleService';
import { ServiceProvider, Review, Vehicle } from '../../types/models';

type AddReviewScreenRouteProp = RouteProp<
  ServicesStackParamList, 
  'AddReview'
>;

const AddReviewScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  const route = useRoute<AddReviewScreenRouteProp>();
  const { serviceId } = route.params;
  const { user } = useAuth();
  
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch service provider and user vehicles on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          Alert.alert('Error', 'You need to be signed in to write a review');
          navigation.goBack();
          return;
        }
        
        // Load service provider data
        const provider = await ServiceProviderService.getServiceProviderById(serviceId);
        if (provider) {
          setServiceProvider(provider);
        } else {
          Alert.alert('Error', 'Service provider not found');
          navigation.goBack();
        }
        
        // Load user vehicles
        const vehicles = await VehicleService.getVehicles(user.id);
        setUserVehicles(vehicles);
        if (vehicles.length > 0) {
          setSelectedVehicle(vehicles[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    loadData();
  }, [serviceId, navigation, user]);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDropdown(false);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'We need camera roll permission to upload review photos');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (reviewImages.length >= 3) {
        Alert.alert('Limit Reached', 'You can upload a maximum of 3 images per review');
        return;
      }
      setReviewImages([...reviewImages, result.assets[0].uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...reviewImages];
    updatedImages.splice(index, 1);
    setReviewImages(updatedImages);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Please enter your review';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Your review is too short (minimum 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user || !serviceProvider) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newReview: Omit<Review, 'id'> = {
        serviceProviderId: serviceId,
        userId: user.id,
        userName: user.name,
        userImage: user.profileImage,
        rating,
        comment,
        date: new Date(),
        serviceType: serviceType || undefined,
        images: reviewImages.length > 0 ? reviewImages : undefined,
        vehicleInfo: selectedVehicle 
          ? {
              make: selectedVehicle.make,
              model: selectedVehicle.model,
              year: selectedVehicle.year,
            }
          : undefined,
        likes: 0,
        verified: true,
      };
      
      await ServiceProviderService.addReview(newReview);
      
      Alert.alert(
        'Success',
        'Your review has been posted',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ServiceDetails', { serviceId }),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit your review. Please try again.');
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
        {/* Service Provider Info */}
        {serviceProvider && (
          <View style={[styles.providerCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.providerName, { color: theme.colors.text }]}>
              {serviceProvider.name}
            </Text>
            <Text style={[styles.providerAddress, { color: theme.colors.textSecondary }]}>
              {serviceProvider.location.address}
            </Text>
          </View>
        )}
        
        {/* Rating */}
        <View style={styles.ratingSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Rate Your Experience
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => handleRatingPress(value)}
                style={styles.starButton}
              >
                <Ionicons
                  name={value <= rating ? "star" : "star-outline"}
                  size={36}
                  color={theme.colors.warning}
                />
              </TouchableOpacity>
            ))}
          </View>
          {errors.rating && (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {errors.rating}
            </Text>
          )}
          <Text style={[styles.ratingText, { color: theme.colors.text }]}>
            {rating === 0 
              ? 'Tap a star to rate' 
              : rating === 5 
                ? 'Excellent!' 
                : rating === 4 
                  ? 'Very Good' 
                  : rating === 3 
                    ? 'Good' 
                    : rating === 2 
                      ? 'Fair' 
                      : 'Poor'}
          </Text>
        </View>
        
        {/* Service Type */}
        <InputField
          label="Service Type (Optional)"
          value={serviceType}
          onChangeText={setServiceType}
          placeholder="e.g., Oil Change, Tire Rotation, Brake Service"
          error={errors.serviceType}
        />
        
        {/* Vehicle Selection */}
        {userVehicles.length > 0 && (
          <View style={styles.vehicleSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Select Your Vehicle (Optional)
            </Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={[
                  styles.vehicleSelector,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
                ]}
                onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
              >
                <Text style={{ color: theme.colors.text }}>
                  {selectedVehicle
                    ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
                    : 'Select a vehicle'}
                </Text>
                <Ionicons
                  name={showVehicleDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              
              {showVehicleDropdown && (
                <View style={[
                  styles.dropdown,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
                ]}>
                  <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                    {userVehicles.map((vehicle) => (
                      <TouchableOpacity
                        key={vehicle.id}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectVehicle(vehicle)}
                      >
                        <Text style={{ color: theme.colors.text }}>
                          {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        )}
        
        {/* Review Text */}
        <View style={styles.reviewSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Write Your Review
          </Text>
          <InputField
            value={comment}
            onChangeText={setComment}
            placeholder="Share your experience with this service provider..."
            multiline
            numberOfLines={6}
            error={errors.comment}
          />
        </View>
        
        {/* Photo Upload */}
        <View style={styles.photosSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Add Photos (Optional)
          </Text>
          <Text style={[styles.photoSubtitle, { color: theme.colors.textSecondary }]}>
            Add up to 3 photos to help others see your experience
          </Text>
          
          <View style={styles.imagesGrid}>
            {reviewImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.reviewImage} />
                <TouchableOpacity
                  style={[styles.removeImageButton, { backgroundColor: theme.colors.error }]}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            
            {reviewImages.length < 3 && (
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
            )}
          </View>
        </View>
        
        {/* Submit Button */}
        <Button
          title="Post Review"
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
  providerCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 20,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerAddress: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingSection: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  starButton: {
    padding: 8,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 4,
  },
  vehicleSection: {
    marginBottom: 20,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  vehicleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dropdown: {
    position: 'absolute',
    top: 55,
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
  reviewSection: {
    marginBottom: 20,
  },
  photosSection: {
    marginBottom: 20,
  },
  photoSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 4,
    position: 'relative',
  },
  reviewImage: {
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 12,
  },
});

export default AddReviewScreen;
