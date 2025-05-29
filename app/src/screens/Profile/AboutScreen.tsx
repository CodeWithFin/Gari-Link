import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen: React.FC = () => {
  const { theme } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          {/* Replace with actual logo */}
          <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.logoText}>GL</Text>
          </View>
          <Text style={[styles.appName, { color: theme.colors.text }]}>GariLink</Text>
          <Text style={[styles.version, { color: theme.colors.text }]}>Version 1.0.0</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About GariLink</Text>
          <Text style={[styles.description, { color: theme.colors.text }]}>
            GariLink is a comprehensive automotive companion app designed specifically for Nairobi car owners. Our mission is to connect car owners with trusted local automotive services and build a community around shared vehicle experiences.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Features</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="car" size={22} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Digital vehicle management
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="construct" size={22} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Find reliable service providers
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={22} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Maintenance reminders
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="people" size={22} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Community groups & discussions
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="location" size={22} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Map-based service discovery
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('mailto:info@garilink.co.ke')}
          >
            <Ionicons name="mail" size={22} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.primary }]}>
              info@garilink.co.ke
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('tel:+254712345678')}
          >
            <Ionicons name="call" size={22} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.primary }]}>
              +254 712 345 678
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => Linking.openURL('https://garilink.co.ke')}
          >
            <Ionicons name="globe" size={22} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.primary }]}>
              www.garilink.co.ke
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialContainer}>
          <Text style={[styles.socialTitle, { color: theme.colors.text }]}>Follow Us</Text>
          <View style={styles.socialIcons}>
            <TouchableOpacity 
              style={[styles.socialIcon, { backgroundColor: theme.colors.primary }]}
              onPress={() => openLink('https://facebook.com/garilink')}
            >
              <Ionicons name="logo-facebook" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIcon, { backgroundColor: theme.colors.primary }]}
              onPress={() => openLink('https://twitter.com/garilink')}
            >
              <Ionicons name="logo-twitter" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.socialIcon, { backgroundColor: theme.colors.primary }]}
              onPress={() => openLink('https://instagram.com/garilink')}
            >
              <Ionicons name="logo-instagram" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.copyright, { color: theme.colors.text }]}>
          © 2023 GariLink. All rights reserved.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    marginLeft: 12,
    textDecorationLine: 'underline',
  },
  socialContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
    marginBottom: 16,
  },
});

export default AboutScreen;
