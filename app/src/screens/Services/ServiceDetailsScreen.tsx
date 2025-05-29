import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ServicesScreenNavigationProp, ServicesStackParamList } from '../../types/navigation';
import { ServiceProvider, Review } from '../../types/models';
import { ServiceProviderService } from '../../services/ServiceProviderService';
import { formatDate } from '../../utils/helpers';
import Button from '../../components/Button';
import Card from '../../components/Card';

type ServiceDetailsScreenRouteProp = RouteProp<
  ServicesStackParamList, 
  'ServiceDetails'
>;

const ServiceDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  const route = useRoute<ServiceDetailsScreenRouteProp>();
  const { serviceId } = route.params;
  const { width } = useWindowDimensions();

  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const currentDay = daysOfWeek[today];

  // Fetch service provider data on mount
  useEffect(() => {
    const loadServiceProvider = async () => {
      try {
        setIsLoading(true);
        const provider = await ServiceProviderService.getServiceProviderById(serviceId);
        if (provider) {
          setServiceProvider(provider);
          
          // Fetch reviews for this service provider
          const providerReviews = await ServiceProviderService.getReviewsForServiceProvider(serviceId);
          setReviews(providerReviews);
        } else {
          Alert.alert('Error', 'Service provider not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading service provider:', error);
        Alert.alert('Error', 'Failed to load service provider data');
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceProvider();
  }, [serviceId, navigation]);

  const handleCall = () => {
    if (serviceProvider?.contact.phone) {
      Linking.openURL(`tel:${serviceProvider.contact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    if (serviceProvider?.contact.whatsapp) {
      Linking.openURL(`https://wa.me/${serviceProvider.contact.whatsapp}`);
    }
  };

  const handleEmail = () => {
    if (serviceProvider?.contact.email) {
      Linking.openURL(`mailto:${serviceProvider.contact.email}`);
    }
  };

  const handleOpenMaps = () => {
    if (serviceProvider?.location) {
      const { latitude, longitude } = serviceProvider.location;
      const url = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  const renderOperatingHours = () => {
    if (!serviceProvider?.operatingHours) return null;
    
    return (
      <Card style={styles.sectionCard}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Operating Hours
        </Text>
        {daysOfWeek.map((day) => {
          const hours = serviceProvider.operatingHours?.[day];
          const isToday = day === currentDay;
          
          return (
            <View 
              key={day} 
              style={[
                styles.hoursRow,
                isToday && { backgroundColor: theme.colors.cardAlt }
              ]}
            >
              <Text 
                style={[
                  styles.dayName, 
                  { color: theme.colors.text },
                  isToday && styles.boldText
                ]}
              >
                {day}
                {isToday && ' (Today)'}
              </Text>
              <Text 
                style={[
                  styles.hoursText, 
                  { 
                    color: hours === 'Closed' 
                      ? theme.colors.error 
                      : theme.colors.text 
                  },
                  isToday && styles.boldText
                ]}
              >
                {hours === 'Closed' 
                  ? 'Closed' 
                  : `${hours?.open} - ${hours?.close}`
                }
              </Text>
            </View>
          );
        })}
      </Card>
    );
  };

  const renderReviews = () => {
    if (reviews.length === 0) {
      return (
        <View style={styles.emptyReviews}>
          <Ionicons name="star-outline" size={36} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyReviewsText, { color: theme.colors.text }]}>
            No reviews yet
          </Text>
          <Text style={[styles.emptyReviewsSubtext, { color: theme.colors.textSecondary }]}>
            Be the first to review this service provider
          </Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Card style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                {item.userImage ? (
                  <Image source={{ uri: item.userImage }} style={styles.userImage} />
                ) : (
                  <View style={[styles.userImagePlaceholder, { backgroundColor: theme.colors.border }]}>
                    <Text style={{ color: theme.colors.text }}>
                      {item.userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {item.userName}
                  </Text>
                  <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>
                    {formatDate(new Date(item.date))}
                  </Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < item.rating ? "star" : "star-outline"}
                    size={16}
                    color={theme.colors.warning}
                  />
                ))}
              </View>
            </View>
            
            {item.serviceType && (
              <View style={[
                styles.serviceTypeTag,
                { backgroundColor: theme.colors.cardAlt, borderColor: theme.colors.border }
              ]}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                  {item.serviceType}
                </Text>
              </View>
            )}
            
            <Text style={[styles.reviewComment, { color: theme.colors.text }]}>
              {item.comment}
            </Text>
            
            {item.images && item.images.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.reviewImagesContainer}
              >
                {item.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.reviewImage}
                  />
                ))}
              </ScrollView>
            )}
            
            {item.vehicleInfo && (
              <View style={[
                styles.vehicleInfoTag,
                { backgroundColor: theme.colors.cardAlt, borderColor: theme.colors.border }
              ]}>
                <Ionicons name="car-outline" size={12} color={theme.colors.textSecondary} />
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginLeft: 4 }}>
                  {`${item.vehicleInfo.year} ${item.vehicleInfo.make} ${item.vehicleInfo.model}`}
                </Text>
              </View>
            )}
            
            <View style={styles.reviewFooter}>
              <View style={styles.likesContainer}>
                <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.likesText, { color: theme.colors.textSecondary }]}>
                  {item.likes}
                </Text>
              </View>
              {item.verified && (
                <View style={styles.verifiedContainer}>
                  <Ionicons name="checkmark-circle" size={14} color={theme.colors.primary} />
                  <Text style={[styles.verifiedText, { color: theme.colors.primary }]}>
                    Verified Visit
                  </Text>
                </View>
              )}
            </View>
          </Card>
        )}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading service provider details...
        </Text>
      </View>
    );
  }

  if (!serviceProvider) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Service provider not found
        </Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()} 
          style={styles.errorButton} 
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Images Carousel */}
      <View style={styles.imageCarousel}>
        {serviceProvider.images && serviceProvider.images.length > 0 ? (
          <>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                setCurrentImageIndex(Math.floor(offsetX / width));
              }}
              scrollEventThrottle={16}
            >
              {serviceProvider.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={[styles.coverImage, { width }]}
                />
              ))}
            </ScrollView>
            {serviceProvider.images.length > 1 && (
              <View style={styles.pagination}>
                {serviceProvider.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      {
                        backgroundColor: index === currentImageIndex
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: theme.colors.border }]}>
            <Ionicons name="business-outline" size={48} color={theme.colors.text} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        {/* Header Info */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.nameContainer}>
              <Text style={[styles.providerName, { color: theme.colors.text }]}>
                {serviceProvider.name}
              </Text>
              {serviceProvider.verified && (
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.primary} />
              )}
            </View>
            <Text style={[styles.providerAddress, { color: theme.colors.textSecondary }]}>
              {serviceProvider.location.address}
            </Text>
            <View style={styles.ratingContainer}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Ionicons
                  key={index}
                  name={index < Math.floor(serviceProvider.rating) ? "star" : "star-outline"}
                  size={16}
                  color={theme.colors.warning}
                />
              ))}
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                {serviceProvider.rating.toFixed(1)} ({serviceProvider.reviewCount} reviews)
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={{ color: theme.colors.textSecondary }}>
                Price Range:
              </Text>
              <Text 
                style={[
                  styles.priceValue, 
                  { 
                    color: 
                      serviceProvider.priceRange === 'Premium' ? theme.colors.error :
                      serviceProvider.priceRange === 'Mid-Range' ? theme.colors.warning :
                      theme.colors.success
                  }
                ]}
              >
                {serviceProvider.priceRange}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleOpenMaps}
          >
            <Ionicons name="navigate" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>
              Navigate
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCall}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.success + '20' }]}>
              <Ionicons name="call" size={20} color={theme.colors.success} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Call</Text>
          </TouchableOpacity>
          
          {serviceProvider.contact.whatsapp && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleWhatsApp}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#25D366' + '20' }]}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>WhatsApp</Text>
            </TouchableOpacity>
          )}
          
          {serviceProvider.contact.email && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleEmail}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="mail" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Email</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddReview', { serviceId })}
          >
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.warning + '20' }]}>
              <Ionicons name="star" size={20} color={theme.colors.warning} />
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Review</Text>
          </TouchableOpacity>
        </View>
        
        {/* Description */}
        {serviceProvider.description && (
          <Card style={styles.sectionCard}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              About
            </Text>
            <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
              {serviceProvider.description}
            </Text>
          </Card>
        )}
        
        {/* Services */}
        <Card style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Services
          </Text>
          <View style={styles.servicesContainer}>
            {serviceProvider.services.map((service, index) => (
              <View 
                key={index}
                style={[
                  styles.serviceTag,
                  { backgroundColor: theme.colors.cardAlt, borderColor: theme.colors.border }
                ]}
              >
                <Text style={{ color: theme.colors.text }}>
                  {service}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        
        {/* Operating Hours */}
        {renderOperatingHours()}
        
        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsSectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Reviews
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddReview', { serviceId })}
              style={styles.addReviewButton}
            >
              <Text style={[styles.addReviewText, { color: theme.colors.primary }]}>
                Write a Review
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          
          {renderReviews()}
          
          {reviews.length > 0 && (
            <TouchableOpacity
              style={[
                styles.viewAllButton,
                { borderColor: theme.colors.border }
              ]}
              onPress={() => {
                // This would navigate to a full reviews page in a real app
                Alert.alert('View All Reviews', 'This would show all reviews in a separate screen.');
              }}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.text }]}>
                View All Reviews ({serviceProvider.reviewCount})
              </Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    width: 120,
  },
  imageCarousel: {
    height: 250,
    position: 'relative',
  },
  coverImage: {
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginRight: 8,
  },
  providerAddress: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceValue: {
    fontWeight: '500',
    marginLeft: 6,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionText: {
    lineHeight: 22,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  dayName: {
    flex: 1,
  },
  hoursText: {
    flex: 1,
    textAlign: 'right',
  },
  boldText: {
    fontWeight: 'bold',
  },
  reviewsSection: {
    marginTop: 8,
  },
  reviewsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addReviewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyReviews: {
    alignItems: 'center',
    padding: 32,
  },
  emptyReviewsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyReviewsSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  reviewCard: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontWeight: '500',
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 12,
    marginTop: 2,
  },
  serviceTypeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  reviewComment: {
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImagesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  vehicleInfoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 12,
    marginLeft: 4,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 12,
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  viewAllText: {
    fontWeight: '500',
    marginRight: 4,
  },
});

export default ServiceDetailsScreen;
