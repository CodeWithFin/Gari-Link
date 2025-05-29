import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AppPreferencesScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>General</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="language-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Language</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>English</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="cash-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Currency</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>KES</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="speedometer-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Distance Unit</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>Kilometers</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="car-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Maintenance Reminders</Text>
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
              <Ionicons name="pricetag-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Service Promotions</Text>
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
              <Ionicons name="chatbubbles-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Community Updates</Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={false ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Display</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="list-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Default List View</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>Grid</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="text-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Text Size</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>Medium</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Map & Location</Text>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="map-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Default Map Type</Text>
            </View>
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: theme.colors.text }]}>Standard</Text>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
            </View>
          </View>
          
          <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="navigate-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Auto-locate Services</Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#767577', true: theme.colors.primary + '80' }}
              thumbColor={true ? theme.colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.resetButton, { borderColor: theme.colors.primary }]}
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.primary }]}>Reset to Default Settings</Text>
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
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.8,
  },
  resetButton: {
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 30,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppPreferencesScreen;
