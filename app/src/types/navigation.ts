import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { CompositeNavigationProp } from '@react-navigation/native';

// Main Tab Navigator
export type MainTabParamList = {
  HomeTab: undefined;
  VehicleTab: undefined;
  ServicesTab: undefined;
  CommunityTab: undefined;
  ProfileTab: undefined;
};

// Home Stack Navigator
export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  AddVehicle: undefined;
};

// Vehicle Stack Navigator
export type VehicleStackParamList = {
  VehicleList: undefined;
  VehicleDetails: { vehicleId: string };
  AddMaintenanceRecord: { vehicleId: string };
  MaintenanceHistory: { vehicleId: string };
  AddReminder: { vehicleId: string };
  EditVehicle: { vehicleId: string };
};

// Services Stack Navigator
export type ServicesStackParamList = {
  ServicesList: undefined;
  ServiceDetails: { serviceId: string };
  MapView: undefined;
  AddReview: { serviceId: string };
  FilterServices: undefined;
};

// Community Stack Navigator
export type CommunityStackParamList = {
  Groups: undefined;
  GroupDetails: { groupId: string };
  Discussion: { discussionId: string };
  CreatePost: { groupId: string };
  UserProfile: { userId: string };
};

// Profile Stack Navigator
export type ProfileStackParamList = {
  UserProfile: undefined;
  Settings: undefined;
  AppPreferences: undefined;
  Help: undefined;
  About: undefined;
};

// Combined navigation types
export type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  StackNavigationProp<HomeStackParamList>
>;

export type VehicleScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'VehicleTab'>,
  StackNavigationProp<VehicleStackParamList>
>;

export type ServicesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ServicesTab'>,
  StackNavigationProp<ServicesStackParamList>
>;

export type CommunityScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'CommunityTab'>,
  StackNavigationProp<CommunityStackParamList>
>;

export type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ProfileTab'>,
  StackNavigationProp<ProfileStackParamList>
>;
