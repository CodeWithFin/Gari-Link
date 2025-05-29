import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Settings</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="phone-portrait-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Phone Number</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Email Address</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Privacy</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="location-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Location Services</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={true ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="notifications-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={true ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data & Storage</Text>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="cloud-download-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Data Usage</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="save-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Storage</Text>
            </View>
            <View style={styles.storageInfo}>
              <Text style={[styles.storageText, { color: theme.colors.text }]}>23.5 MB</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name="trash-outline" size={22} color={theme.colors.error} />
              <Text style={[styles.menuItemText, { color: theme.colors.error }]}>Clear Cache</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.dangerButton, { borderColor: theme.colors.error }]}
        >
          <Text style={[styles.dangerButtonText, { color: theme.colors.error }]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  storageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageText: {
    fontSize: 14,
    marginRight: 8,
  },
  dangerButton: {
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 30,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsScreen;
