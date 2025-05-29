import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommunityScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';

// Mock data for development
const MOCK_GROUPS = [
  { id: '1', name: 'Nairobi Car Enthusiasts', members: 1203, description: 'For all car lovers in Nairobi' },
  { id: '2', name: 'Toyota Owners Kenya', members: 856, description: 'Toyota owners discussion group' },
  { id: '3', name: 'EV Owners Kenya', members: 142, description: 'Electric vehicle owners in Kenya' },
  { id: '4', name: 'Mechanics Connect', members: 432, description: 'Connect with certified mechanics' },
  { id: '5', name: 'DIY Car Repairs', members: 675, description: 'Share DIY car repair tips and tricks' },
];

const GroupsScreen: React.FC = () => {
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { theme } = useTheme();

  const renderGroupItem = ({ item }: { item: typeof MOCK_GROUPS[0] }) => (
    <TouchableOpacity 
      style={[styles.groupCard, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
    >
      <Text style={[styles.groupName, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.groupMembers, { color: theme.colors.text }]}>
        {item.members} members
      </Text>
      <Text style={[styles.groupDescription, { color: theme.colors.text }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={MOCK_GROUPS}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity 
        style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => {/* Navigate to create group screen */}}
      >
        <Text style={styles.createButtonText}>Create New Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  groupCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  groupDescription: {
    fontSize: 14,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 3,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GroupsScreen;
