import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ServicesScreenNavigationProp } from '../../types/navigation';
import { ServiceProvider } from '../../types/models';
import { ServiceProviderService } from '../../services/ServiceProviderService';
import Card from '../../components/Card';
import { useDebounce } from '../../hooks/useDebounce';

const ServicesListScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<ServicesScreenNavigationProp>();
  
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Categories for quick filtering
  const serviceCategories = [
    'All',
    'Mechanics',
    'Tire Services',
    'Body Shop',
    'Car Wash',
    'Parts',
    'Electric',
    'Dealerships',
  ];

  // Fetch service providers data on mount
  useEffect(() => {
    const loadServiceProviders = async () => {
      try {
        setIsLoading(true);
        const providers = await ServiceProviderService.getServiceProviders();
        setServiceProviders(providers);
        setFilteredProviders(providers);
      } catch (error) {
        console.error('Error loading service providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceProviders();
  }, []);

  // Filter providers based on search query and selected category
  useEffect(() => {
    if (!serviceProviders.length) return;

    let results = [...serviceProviders];
    
    // Apply search filter
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      results = results.filter(
        provider => 
          provider.name.toLowerCase().includes(query) ||
          provider.location.address.toLowerCase().includes(query) ||
          provider.services.some(service => service.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter(provider => {
        const categoryMapping: Record<string, string[]> = {
          'Mechanics': ['Repair', 'Maintenance', 'Diagnostics'],
          'Tire Services': ['Tire', 'Wheel', 'Alignment'],
          'Body Shop': ['Paint', 'Body', 'Dent'],
          'Car Wash': ['Wash', 'Detailing', 'Cleaning'],
          'Parts': ['Parts', 'Accessories', 'Spares'],
          'Electric': ['Electrical', 'Battery', 'Electronics'],
          'Dealerships': ['New Cars', 'Used Cars', 'Dealer'],
        };
        
        const relevantTags = categoryMapping[selectedCategory] || [selectedCategory];
        return provider.services.some(service => 
          relevantTags.some(tag => service.includes(tag))
        );
      });
    }
    
    setFilteredProviders(results);
  }, [debouncedSearchQuery, selectedCategory, serviceProviders]);

  const renderServiceProvider = ({ item }: { item: ServiceProvider }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}
        activeOpacity={0.7}
      >
        <Card style={styles.providerCard}>
          <View style={styles.providerHeader}>
            {item.images && item.images.length > 0 ? (
              <Image source={{ uri: item.images[0] }} style={styles.providerImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.colors.border }]}>
                <Ionicons name="business-outline" size={24} color={theme.colors.text} />
              </View>
            )}
            <View style={styles.providerInfo}>
              <View style={styles.nameContainer}>
                <Text style={[styles.providerName, { color: theme.colors.text }]}>
                  {item.name}
                </Text>
                {item.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                )}
              </View>
              <Text style={[styles.providerAddress, { color: theme.colors.textSecondary }]}>
                {item.location.address}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color={theme.colors.warning} />
                <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                  {item.rating.toFixed(1)} ({item.reviewCount} reviews)
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.servicesContainer}>
            {item.services.slice(0, 3).map((service, index) => (
              <View 
                key={index}
                style={[
                  styles.serviceTag,
                  { 
                    backgroundColor: theme.colors.cardAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text 
                  style={[styles.serviceTagText, { color: theme.colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {service}
                </Text>
              </View>
            ))}
            {item.services.length > 3 && (
              <Text style={[styles.moreServices, { color: theme.colors.textSecondary }]}>
                +{item.services.length - 3} more
              </Text>
            )}
          </View>
          
          <View style={styles.priceAndDistance}>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                Price Range:
              </Text>
              <Text style={[styles.priceValue, { color: theme.colors.text }]}>
                {item.priceRange}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.mapButton,
                { backgroundColor: theme.colors.primary + '20', borderColor: theme.colors.primary }
              ]}
              onPress={() => navigation.navigate('MapView')}
            >
              <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
              <Text style={[styles.mapButtonText, { color: theme.colors.primary }]}>Map</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }: { item: string }) => {
    const isSelected = (selectedCategory === item) || (selectedCategory === null && item === 'All');
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && { backgroundColor: theme.colors.primary },
          { borderColor: theme.colors.border }
        ]}
        onPress={() => setSelectedCategory(item === 'All' ? null : item)}
      >
        <Text 
          style={[
            styles.categoryText,
            { color: isSelected ? theme.colors.white : theme.colors.text }
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search and Filter Header */}
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search service providers..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('FilterServices')}
        >
          <Ionicons name="options-outline" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      {/* Categories Horizontal List */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={serviceCategories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Service Providers List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading service providers...
          </Text>
        </View>
      ) : (
        <>
          {filteredProviders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No service providers found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredProviders}
              renderItem={renderServiceProvider}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.providersList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
      
      {/* Map View FAB */}
      <TouchableOpacity
        style={[styles.mapFab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('MapView')}
      >
        <Ionicons name="map" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  providersList: {
    padding: 16,
  },
  providerCard: {
    marginBottom: 16,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  providerAddress: {
    fontSize: 14,
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  serviceTagText: {
    fontSize: 12,
  },
  moreServices: {
    fontSize: 12,
    marginLeft: 4,
    alignSelf: 'center',
  },
  priceAndDistance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  mapButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  mapFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ServicesListScreen;
