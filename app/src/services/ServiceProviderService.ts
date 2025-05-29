import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceProvider, Review } from '../types/models';
import { generateId } from '../utils/helpers';

// Storage keys
const SERVICE_PROVIDERS_STORAGE_KEY = '@garilink:service_providers';
const REVIEWS_STORAGE_KEY = '@garilink:reviews';

/**
 * Service for managing service provider data in local storage
 */
export const ServiceProviderService = {
  /**
   * Get all service providers
   * @returns Promise resolving to an array of service providers
   */
  getServiceProviders: async (): Promise<ServiceProvider[]> => {
    try {
      const data = await AsyncStorage.getItem(SERVICE_PROVIDERS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Initialize with mock data if no data exists
      const mockData = getMockServiceProviders();
      await AsyncStorage.setItem(
        SERVICE_PROVIDERS_STORAGE_KEY, 
        JSON.stringify(mockData)
      );
      return mockData;
    } catch (error) {
      console.error('Error getting service providers:', error);
      throw error;
    }
  },

  /**
   * Get a service provider by ID
   * @param providerId The service provider ID
   * @returns Promise resolving to a service provider or null if not found
   */
  getServiceProviderById: async (providerId: string): Promise<ServiceProvider | null> => {
    try {
      const data = await AsyncStorage.getItem(SERVICE_PROVIDERS_STORAGE_KEY);
      if (data) {
        const providers: ServiceProvider[] = JSON.parse(data);
        return providers.find(provider => provider.id === providerId) || null;
      }
      return null;
    } catch (error) {
      console.error('Error getting service provider by ID:', error);
      throw error;
    }
  },

  /**
   * Search service providers by name, service, or location
   * @param searchTerm The search term
   * @returns Promise resolving to filtered service providers
   */
  searchServiceProviders: async (searchTerm: string): Promise<ServiceProvider[]> => {
    try {
      const providers = await this.getServiceProviders();
      const term = searchTerm.toLowerCase().trim();
      
      if (!term) return providers;
      
      return providers.filter(
        provider =>
          provider.name.toLowerCase().includes(term) ||
          provider.services.some(service => service.toLowerCase().includes(term)) ||
          provider.location.address.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching service providers:', error);
      throw error;
    }
  },

  /**
   * Filter service providers by criteria
   * @param criteria The filter criteria
   * @returns Promise resolving to filtered service providers
   */
  filterServiceProviders: async (criteria: {
    services?: string[];
    priceRange?: ('Budget' | 'Mid-Range' | 'Premium')[];
    minRating?: number;
    verified?: boolean;
  }): Promise<ServiceProvider[]> => {
    try {
      const providers = await this.getServiceProviders();
      
      return providers.filter(provider => {
        // Filter by services
        if (criteria.services && criteria.services.length > 0) {
          const hasMatchingService = provider.services.some(service =>
            criteria.services!.includes(service)
          );
          if (!hasMatchingService) return false;
        }
        
        // Filter by price range
        if (criteria.priceRange && criteria.priceRange.length > 0) {
          if (!criteria.priceRange.includes(provider.priceRange)) return false;
        }
        
        // Filter by minimum rating
        if (criteria.minRating !== undefined) {
          if (provider.rating < criteria.minRating) return false;
        }
        
        // Filter by verification status
        if (criteria.verified !== undefined) {
          if (provider.verified !== criteria.verified) return false;
        }
        
        return true;
      });
    } catch (error) {
      console.error('Error filtering service providers:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a service provider
   * @param providerId The service provider ID
   * @returns Promise resolving to an array of reviews
   */
  getReviews: async (providerId: string): Promise<Review[]> => {
    try {
      const data = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      if (data) {
        const allReviews: Review[] = JSON.parse(data);
        return allReviews
          .filter(review => review.serviceProviderId === providerId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
      return [];
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  },

  /**
   * Add a new review
   * @param review The review to add (without ID)
   * @returns Promise resolving to the created review with ID
   */
  addReview: async (review: Omit<Review, 'id'>): Promise<Review> => {
    try {
      const newReview: Review = {
        ...review,
        id: generateId(),
        date: typeof review.date === 'string' ? new Date(review.date) : review.date,
      };

      const data = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      let reviews: Review[] = [];
      
      if (data) {
        reviews = JSON.parse(data);
      }
      
      reviews.push(newReview);
      await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
      
      // Update service provider rating
      await this.updateServiceProviderRating(review.serviceProviderId);
      
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  /**
   * Update service provider rating based on reviews
   * @param providerId The service provider ID
   * @returns Promise resolving to the updated service provider
   */
  updateServiceProviderRating: async (providerId: string): Promise<ServiceProvider | null> => {
    try {
      const reviews = await this.getReviews(providerId);
      const provider = await this.getServiceProviderById(providerId);
      
      if (!provider) return null;
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      const updatedProvider = {
        ...provider,
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: reviews.length,
      };
      
      const data = await AsyncStorage.getItem(SERVICE_PROVIDERS_STORAGE_KEY);
      if (data) {
        let providers: ServiceProvider[] = JSON.parse(data);
        const index = providers.findIndex(p => p.id === providerId);
        
        if (index !== -1) {
          providers[index] = updatedProvider;
          await AsyncStorage.setItem(SERVICE_PROVIDERS_STORAGE_KEY, JSON.stringify(providers));
        }
      }
      
      return updatedProvider;
    } catch (error) {
      console.error('Error updating service provider rating:', error);
      throw error;
    }
  },
};

/**
 * Generate mock service providers for Nairobi
 * @returns Array of mock service providers
 */
function getMockServiceProviders(): ServiceProvider[] {
  return [
    {
      id: 'sp1',
      name: 'AutoXpress Westlands',
      location: {
        latitude: -1.2673,
        longitude: 36.8081,
        address: 'Westlands, Nairobi',
      },
      services: ['Oil Change', 'Brake Service', 'Wheel Alignment', 'Tire Services'],
      priceRange: 'Premium',
      rating: 4.5,
      reviewCount: 124,
      verified: true,
      contact: {
        phone: '+254700123456',
        whatsapp: '+254700123456',
        email: 'info@autoxpress.co.ke',
      },
      operatingHours: {
        Monday: { open: '08:00', close: '18:00' },
        Tuesday: { open: '08:00', close: '18:00' },
        Wednesday: { open: '08:00', close: '18:00' },
        Thursday: { open: '08:00', close: '18:00' },
        Friday: { open: '08:00', close: '18:00' },
        Saturday: { open: '09:00', close: '15:00' },
        Sunday: 'Closed',
      },
      description: 'AutoXpress is a leading auto service provider in Nairobi with state-of-the-art equipment and certified technicians.',
    },
    {
      id: 'sp2',
      name: 'Ngong Road Auto Garage',
      location: {
        latitude: -1.3006,
        longitude: 36.7671,
        address: 'Ngong Road, Nairobi',
      },
      services: ['Engine Repair', 'Electrical Systems', 'Body Work', 'Painting'],
      priceRange: 'Mid-Range',
      rating: 4.0,
      reviewCount: 87,
      verified: true,
      contact: {
        phone: '+254711987654',
        whatsapp: '+254711987654',
      },
      description: 'Specializing in engine repairs and electrical systems, our experienced team provides quality service at affordable prices.',
    },
    {
      id: 'sp3',
      name: 'Mombasa Road Tire Center',
      location: {
        latitude: -1.3191,
        longitude: 36.8259,
        address: 'Mombasa Road, Nairobi',
      },
      services: ['Tire Sales', 'Tire Repair', 'Wheel Balancing', 'Nitrogen Filling'],
      priceRange: 'Budget',
      rating: 3.8,
      reviewCount: 65,
      verified: false,
      contact: {
        phone: '+254722555666',
      },
      description: 'Complete tire services at competitive prices. We stock all major brands for various vehicle types.',
    },
    {
      id: 'sp4',
      name: 'Karen Auto Clinic',
      location: {
        latitude: -1.3268,
        longitude: 36.7132,
        address: 'Karen, Nairobi',
      },
      services: ['Diagnostics', 'Engine Tune-up', 'Suspension Repair', 'Luxury Vehicle Service'],
      priceRange: 'Premium',
      rating: 4.7,
      reviewCount: 92,
      verified: true,
      contact: {
        phone: '+254733111222',
        whatsapp: '+254733111222',
        email: 'service@karenauto.co.ke',
      },
      description: 'Specialized in luxury and high-performance vehicles with certified technicians and original parts.',
    },
    {
      id: 'sp5',
      name: 'Eastleigh Motors',
      location: {
        latitude: -1.2788,
        longitude: 36.8512,
        address: 'Eastleigh, Nairobi',
      },
      services: ['Used Parts', 'Quick Repairs', 'Customization', 'Window Tinting'],
      priceRange: 'Budget',
      rating: 3.5,
      reviewCount: 45,
      verified: false,
      contact: {
        phone: '+254744999888',
      },
      description: 'Fast and affordable repairs with quality used parts. Specializing in quick fixes to get you back on the road.',
    },
    {
      id: 'sp6',
      name: 'Industrial Area Truck Center',
      location: {
        latitude: -1.3043,
        longitude: 36.8545,
        address: 'Industrial Area, Nairobi',
      },
      services: ['Heavy Vehicle Repair', 'Commercial Vehicle Service', 'Fleet Maintenance', 'Diesel Engine Specialist'],
      priceRange: 'Mid-Range',
      rating: 4.2,
      reviewCount: 38,
      verified: true,
      contact: {
        phone: '+254755444333',
        email: 'trucks@industrialauto.co.ke',
      },
      description: 'Specialized in commercial and heavy vehicles with capacity to handle fleet maintenance contracts.',
    },
    {
      id: 'sp7',
      name: 'Kilimani Quick Service',
      location: {
        latitude: -1.2862,
        longitude: 36.7731,
        address: 'Kilimani, Nairobi',
      },
      services: ['Oil Change', 'Filter Replacement', 'Battery Service', 'Air Conditioning'],
      priceRange: 'Mid-Range',
      rating: 4.1,
      reviewCount: 76,
      verified: true,
      contact: {
        phone: '+254766777888',
        whatsapp: '+254766777888',
      },
      description: 'Quick service center offering fast maintenance services with no appointment necessary.',
    },
    {
      id: 'sp8',
      name: 'CBD Auto Parts',
      location: {
        latitude: -1.2833,
        longitude: 36.8232,
        address: 'CBD, Nairobi',
      },
      services: ['Parts Sales', 'Accessories', 'Audio Systems', 'Security Systems'],
      priceRange: 'Budget',
      rating: 3.9,
      reviewCount: 104,
      verified: false,
      contact: {
        phone: '+254777888999',
        whatsapp: '+254777888999',
      },
      description: 'Comprehensive auto parts store with both original and aftermarket parts for all vehicle makes and models.',
    },
    {
      id: 'sp9',
      name: 'Lavington Prestige Motors',
      location: {
        latitude: -1.2735,
        longitude: 36.7756,
        address: 'Lavington, Nairobi',
      },
      services: ['European Car Specialist', 'Computerized Diagnostics', 'Performance Upgrades', 'Scheduled Maintenance'],
      priceRange: 'Premium',
      rating: 4.8,
      reviewCount: 67,
      verified: true,
      contact: {
        phone: '+254788123456',
        whatsapp: '+254788123456',
        email: 'info@prestigemotors.co.ke',
      },
      description: 'Specializing in European luxury cars with factory-trained technicians and state-of-the-art diagnostic equipment.',
    },
    {
      id: 'sp10',
      name: 'Thika Road Car Wash & Detailing',
      location: {
        latitude: -1.2397,
        longitude: 36.8855,
        address: 'Thika Road, Nairobi',
      },
      services: ['Car Wash', 'Detailing', 'Interior Cleaning', 'Paint Protection'],
      priceRange: 'Mid-Range',
      rating: 4.3,
      reviewCount: 158,
      verified: true,
      contact: {
        phone: '+254799888777',
        whatsapp: '+254799888777',
      },
      description: 'Premium car wash and detailing services using eco-friendly products and professional equipment.',
    },
  ];
}
