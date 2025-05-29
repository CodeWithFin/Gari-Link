import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

// Mock user data
const MOCK_USER = {
  name: 'James Kamau',
  email: 'james.kamau@example.com',
  phone: '+254 712 345 678',
  location: 'Nairobi, Kenya',
  profileImage: null, // Will use initials instead
};

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme, themeType, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>{MOCK_USER.name.charAt(0)}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{MOCK_USER.name}</Text>
          <Text style={styles.userEmail}>{MOCK_USER.email}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => {/* Navigate to edit profile */}}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('AppPreferences')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="options-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>App Preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons 
                name={themeType === 'dark' ? "moon" : "sunny"}
                size={22} 
                color={theme.colors.primary} 
              />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={themeType === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={themeType === 'dark' ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('Help')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-circle-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => {/* Navigate to feedback */}}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="chatbox-ellipses-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Send Feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
            onPress={() => navigation.navigate('About')}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="information-circle-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>About GariLink</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutButtonText, { color: theme.colors.error }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.text }]}>Version 1.0.0</Text>
        </View>
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
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E63946',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default UserProfileScreen;
