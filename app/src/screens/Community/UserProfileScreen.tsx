import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { CommunityStackParamList, CommunityScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type UserProfileScreenRouteProp = RouteProp<CommunityStackParamList, 'UserProfile'>;

// Mock data for development
const MOCK_USER = {
  id: 'user123',
  name: 'James Kamau',
  username: '@jkamau',
  bio: 'Car enthusiast | Toyota Land Cruiser owner | Based in Nairobi',
  memberSince: 'May 2022',
  vehicles: [
    {
      id: 'v1',
      name: 'Toyota Land Cruiser Prado',
      year: '2018'
    }
  ],
  stats: {
    posts: 24,
    comments: 138,
    groups: 5
  }
};

const MOCK_POSTS = [
  {
    id: 'p1',
    title: 'Best garages in Westlands area?',
    preview: 'I recently moved to Westlands and need recommendations for reliable garages in the area. My car needs a service soon...',
    group: 'Nairobi Car Enthusiasts',
    groupId: 'g1',
    date: '3 days ago',
    comments: 23
  },
  {
    id: 'p2',
    title: 'Land Cruiser suspension upgrade recommendations?',
    preview: 'Looking to upgrade the suspension on my 2018 Land Cruiser Prado. Has anyone tried the new TRD suspension kit?',
    group: 'Toyota Owners Kenya',
    groupId: 'g2',
    date: '1 week ago',
    comments: 15
  },
  {
    id: 'p3',
    title: 'Best dashcam for Kenyan roads',
    preview: 'I want to install a dashcam in my vehicle. Any recommendations that work well in our bright sunlight and can handle the bumpy roads?',
    group: 'Car Gadgets & Tech',
    groupId: 'g3',
    date: '2 weeks ago',
    comments: 31
  },
];

const UserProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'activity'>('posts');
  
  const route = useRoute<UserProfileScreenRouteProp>();
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { theme } = useTheme();
  const { userId } = route.params;

  // In a real app, we would fetch the user details using the userId
  // For now, we'll just use the mock data

  const renderPostItem = ({ item }: { item: typeof MOCK_POSTS[0] }) => (
    <TouchableOpacity 
      style={[styles.postItem, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('Discussion', { discussionId: item.id })}
    >
      <Text style={[styles.postTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <Text style={[styles.postPreview, { color: theme.colors.text }]}>{item.preview}</Text>
      <View style={styles.postFooter}>
        <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { groupId: item.groupId })}>
          <Text style={[styles.groupName, { color: theme.colors.primary }]}>{item.group}</Text>
        </TouchableOpacity>
        <View style={styles.postStats}>
          <Text style={[styles.postDate, { color: theme.colors.text }]}>{item.date}</Text>
          <View style={styles.commentCount}>
            <Ionicons name="chatbubble-outline" size={14} color={theme.colors.text} />
            <Text style={[styles.commentCountText, { color: theme.colors.text }]}>{item.comments}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.card }]}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.profileInitial}>{MOCK_USER.name.charAt(0)}</Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{MOCK_USER.name}</Text>
          <Text style={[styles.userUsername, { color: theme.colors.text }]}>{MOCK_USER.username}</Text>
          <Text style={[styles.userBio, { color: theme.colors.text }]}>{MOCK_USER.bio}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{MOCK_USER.stats.posts}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{MOCK_USER.stats.comments}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>Comments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>{MOCK_USER.stats.groups}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.text }]}>Groups</Text>
            </View>
          </View>
          
          <View style={styles.memberInfo}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.text} />
            <Text style={[styles.memberSince, { color: theme.colors.text }]}>
              Member since {MOCK_USER.memberSince}
            </Text>
          </View>
          
          <View style={[styles.vehiclesContainer, { borderColor: theme.colors.border }]}>
            <Text style={[styles.vehiclesTitle, { color: theme.colors.text }]}>
              Vehicles
            </Text>
            {MOCK_USER.vehicles.map(vehicle => (
              <View key={vehicle.id} style={styles.vehicleItem}>
                <Ionicons name="car" size={16} color={theme.colors.primary} />
                <Text style={[styles.vehicleName, { color: theme.colors.text }]}>
                  {vehicle.year} {vehicle.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'posts' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'posts' ? theme.colors.primary : theme.colors.text }
            ]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'activity' && [styles.activeTab, { borderColor: theme.colors.primary }]
            ]}
            onPress={() => setActiveTab('activity')}
          >
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'activity' ? theme.colors.primary : theme.colors.text }
            ]}>
              Recent Activity
            </Text>
          </TouchableOpacity>
        </View>
        
        {activeTab === 'posts' && (
          <View style={styles.postsContainer}>
            {MOCK_POSTS.map(post => renderPostItem({ item: post }))}
          </View>
        )}
        
        {activeTab === 'activity' && (
          <View style={[styles.activityContainer, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.activityPlaceholder, { color: theme.colors.text }]}>
              Recent activity will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    marginBottom: 12,
    opacity: 0.7,
  },
  userBio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  memberSince: {
    fontSize: 14,
    marginLeft: 6,
  },
  vehiclesContainer: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  vehiclesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vehicleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleName: {
    marginLeft: 8,
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: '500',
  },
  postsContainer: {
    padding: 16,
  },
  postItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postPreview: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 12,
    fontWeight: '500',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postDate: {
    fontSize: 12,
    marginRight: 12,
  },
  commentCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCountText: {
    fontSize: 12,
    marginLeft: 4,
  },
  activityContainer: {
    padding: 20,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  activityPlaceholder: {
    opacity: 0.6,
  },
});

export default UserProfileScreen;
