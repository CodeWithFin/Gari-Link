import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CommunityStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

// Import screens
import GroupsScreen from '../screens/Community/GroupsScreen';
import GroupDetailsScreen from '../screens/Community/GroupDetailsScreen';
import DiscussionScreen from '../screens/Community/DiscussionScreen';
import CreatePostScreen from '../screens/Community/CreatePostScreen';
import UserProfileScreen from '../screens/Community/UserProfileScreen';

const Stack = createStackNavigator<CommunityStackParamList>();

const CommunityStack: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen 
        name="Groups" 
        component={GroupsScreen} 
        options={{ title: 'Discussion Groups' }}
      />
      <Stack.Screen 
        name="GroupDetails" 
        component={GroupDetailsScreen} 
        options={({ route }) => ({ title: 'Group Details' })}
      />
      <Stack.Screen 
        name="Discussion" 
        component={DiscussionScreen} 
        options={{ title: 'Discussion' }}
      />
      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={{ title: 'Create Post' }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
        options={{ title: 'User Profile' }}
      />
    </Stack.Navigator>
  );
};

export default CommunityStack;
