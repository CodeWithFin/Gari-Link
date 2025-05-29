import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();

  const faqItems = [
    {
      question: 'How do I add my vehicle?',
      answer: 'To add your vehicle, go to the "My Vehicle" tab and tap on the "+" button. Fill in your vehicle details and tap "Save".'
    },
    {
      question: 'How do I find a service provider?',
      answer: 'Go to the "Services" tab where you can browse through various service providers. You can filter by service type, location, and ratings.'
    },
    {
      question: 'How do I set maintenance reminders?',
      answer: 'Open your vehicle details, go to "Reminders" and tap "Add New Reminder". Set the maintenance type, date, and frequency of the reminder.'
    },
    {
      question: 'How do I join a community group?',
      answer: 'In the "Community" tab, browse through available groups. Open a group and tap "Join Group" to become a member.'
    },
    {
      question: 'Can I change the app theme?',
      answer: 'Yes, go to "Profile" > "App Preferences" where you can toggle between light and dark themes.'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
          
          {faqItems.map((item, index) => (
            <View 
              key={index}
              style={[styles.faqItem, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.question, { color: theme.colors.text }]}>{item.question}</Text>
              <Text style={[styles.answer, { color: theme.colors.text }]}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Support</Text>
          
          <TouchableOpacity 
            style={[styles.contactItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.contactItemLeft}>
              <Ionicons name="mail-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.contactItemText, { color: theme.colors.text }]}>
                Email Support
              </Text>
            </View>
            <Text style={[styles.contactValue, { color: theme.colors.primary }]}>
              support@garilink.co.ke
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.contactItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.contactItemLeft}>
              <Ionicons name="call-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.contactItemText, { color: theme.colors.text }]}>
                Phone Support
              </Text>
            </View>
            <Text style={[styles.contactValue, { color: theme.colors.primary }]}>
              +254 712 345 678
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.contactItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.contactItemLeft}>
              <Ionicons name="chatbubbles-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.contactItemText, { color: theme.colors.text }]}>
                Live Chat
              </Text>
            </View>
            <Text style={[styles.contactValue, { color: theme.colors.primary }]}>
              Start Chat
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Help Resources</Text>
          
          <TouchableOpacity 
            style={[styles.resourceItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.resourceItemLeft}>
              <Ionicons name="book-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.resourceItemText, { color: theme.colors.text }]}>
                User Guide
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resourceItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.resourceItemLeft}>
              <Ionicons name="videocam-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.resourceItemText, { color: theme.colors.text }]}>
                Video Tutorials
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resourceItem, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.resourceItemLeft}>
              <Ionicons name="globe-outline" size={22} color={theme.colors.primary} />
              <Text style={[styles.resourceItemText, { color: theme.colors.text }]}>
                Website
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
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
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 4,
  },
  faqItem: {
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  contactValue: {
    fontSize: 14,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  resourceItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default HelpScreen;
