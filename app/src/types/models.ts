// User model
export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  profileImage?: string;
  joinDate: Date;
  reputationScore: number;
}

// Vehicle model
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  currentMileage: number;
  image?: string;
  licensePlate?: string;
  engineType?: string;
  transmission?: 'Manual' | 'Automatic';
  purchaseDate?: Date;
  color?: string;
}

// Maintenance record model
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: Date;
  mileage: number;
  serviceType: string;
  description: string;
  cost: number;
  location: string;
  receiptImages?: string[];
  performedBy?: string;
  notes?: string;
}

// Service reminder model
export interface Reminder {
  id: string;
  vehicleId: string;
  serviceType: string;
  description?: string;
  targetDate?: Date;
  targetMileage?: number;
  isCompleted: boolean;
  reminderSent: boolean;
  priority: 'Low' | 'Medium' | 'High';
  recurrence?: {
    interval: number;
    unit: 'Days' | 'Weeks' | 'Months' | 'KM';
  };
}

// Service provider model
export interface ServiceProvider {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  services: string[];
  priceRange: 'Budget' | 'Mid-Range' | 'Premium';
  rating: number;
  reviewCount: number;
  verified: boolean;
  contact: {
    phone: string;
    whatsapp?: string;
    email?: string;
  };
  operatingHours?: {
    [key: string]: { open: string; close: string } | 'Closed';
  };
  images?: string[];
  description?: string;
}

// Review model
export interface Review {
  id: string;
  serviceProviderId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: Date;
  images?: string[];
  serviceType?: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
  likes: number;
  verified: boolean;
}

// Discussion group model
export interface DiscussionGroup {
  id: string;
  name: string;
  description: string;
  carMake?: string;
  carModel?: string;
  memberCount: number;
  imageUrl?: string;
  createdDate: Date;
  isOfficial: boolean;
}

// Discussion post model
export interface Post {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  userImage?: string;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  commentCount: number;
  isPinned: boolean;
  isAnnouncement: boolean;
  tags?: string[];
}

// Comment model
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  parentCommentId?: string;
}

// Notification model
export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'community' | 'system' | 'review';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
  data?: any;
}
