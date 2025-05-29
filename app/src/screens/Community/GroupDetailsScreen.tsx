import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { CommunityStackParamList, CommunityScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type GroupDetailsScreenRouteProp = RouteProp<CommunityStackParamList, 'GroupDetails'>;

// Mock data for development
const MOCK_GROUP = {
  id: '1',
  name: 'Nairobi Car Enthusiasts',
  members: 1203,
  description: 'A community for car enthusiasts in Nairobi to discuss all things automotive. Share your experiences, ask questions, and connect with fellow car lovers.',
  established: 'January 2022',
};

const MOCK_DISCUSSIONS = [
  { 
    id: '1', 
    title: 'Best garages in Westlands area?', 
    author: 'James Kamau', 
    responses: 23, 
    lastActive: '2 hours ago',
    pinned: true
  },
  { 
    id: '2', 
    title: 'Recommended mechanics for Toyota Prius?', 
    author: 'Lucy Njeri', 
    responses: 15, 
    lastActive: '1 day ago',
    pinned: false
  },
  { 
    id: '3', 
    title: 'Weekend car meetup in Karura Forest', 
    author: 'Mike Omondi', 
    responses: 42, 
    lastActive: '5 hours ago',
    pinned: false
  },
  { 
    id: '4', 
    title: 'Help needed: Car battery keeps dying', 
    author: 'Sarah Wangari', 
    responses: 8, 
    lastActive: '3 days ago',
    pinned: false
  },
];

const GroupDetailsScreen: React.FC = () => {
  const [isJoined, setIsJoined] = useState(false);
  const route = useRoute<GroupDetailsScreenRouteProp>();
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { theme } = useTheme();
  const { groupId } = route.params;

  // In a real app, we would fetch the group details using the groupId
  // For now, we'll just use the mock data

  const renderDiscussionItem = ({ item }: { item: typeof MOCK_DISCUSSIONS[0] }) => (
    <TouchableOpacity 
      style={[styles.discussionItem, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('Discussion', { discussionId: item.id })}
    >
      {item.pinned && (
        <View style={styles.pinnedTag}>
          <Ionicons name="pin" size={12} color="white" />
          <Text style={styles.pinnedText}>Pinned</Text>
        </View>
      )}
      <Text style={[styles.discussionTitle, { color: theme.colors.text }]}>{item.title}</Text>
      <View style={styles.discussionMeta}>
        <Text style={[styles.discussionAuthor, { color: theme.colors.text }]}>
          By {item.author}
        </Text>
        <Text style={[styles.discussionResponses, { color: theme.colors.primary }]}>
          {item.responses} responses
        </Text>
      </View>
      <Text style={[styles.lastActive, { color: theme.colors.text }]}>
        Active {item.lastActive}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.groupHeader, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.groupName, { color: theme.colors.text }]}>
          {MOCK_GROUP.name}
        </Text>
        <Text style={[styles.groupDescription, { color: theme.colors.text }]}>
          {MOCK_GROUP.description}
        </Text>
        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {MOCK_GROUP.members}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>Members</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {MOCK_DISCUSSIONS.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>Discussions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
              {MOCK_GROUP.established}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text }]}>Established</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.joinButton, 
            { backgroundColor: isJoined ? theme.colors.card : theme.colors.primary,
              borderColor: theme.colors.primary }
          ]}
          onPress={() => setIsJoined(!isJoined)}
        >
          <Text style={[
            styles.joinButtonText, 
            { color: isJoined ? theme.colors.primary : 'white' }
          ]}>
            {isJoined ? 'Joined' : 'Join Group'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.discussionsHeader}>
        <Text style={[styles.discussionsTitle, { color: theme.colors.text }]}>Discussions</Text>
      </View>

      <FlatList
        data={MOCK_DISCUSSIONS}
        renderItem={renderDiscussionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreatePost', { groupId })}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupHeader: {
    padding: 16,
    marginBottom: 8,
  },
  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  joinButton: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  joinButtonText: {
    fontWeight: 'bold',
  },
  discussionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  discussionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  discussionItem: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  pinnedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4a261',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginBottom: 8,
  },
  pinnedText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 4,
  },
  discussionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  discussionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  discussionAuthor: {
    fontSize: 12,
  },
  discussionResponses: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 11,
    opacity: 0.7,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default GroupDetailsScreen;
