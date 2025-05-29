import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { CommunityStackParamList, CommunityScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type CreatePostScreenRouteProp = RouteProp<CommunityStackParamList, 'CreatePost'>;

const CreatePostScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const route = useRoute<CreatePostScreenRouteProp>();
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { theme } = useTheme();
  const { groupId } = route.params;

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your post');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content for your post');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate back to group details
      navigation.navigate('GroupDetails', { groupId });
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Post Title</Text>
          <TextInput
            style={[
              styles.input, 
              { 
                color: theme.colors.text,
                backgroundColor: theme.dark ? '#2c2c2c' : '#f5f5f5',
                borderColor: theme.colors.border
              }
            ]}
            placeholder="Enter a title for your post..."
            placeholderTextColor={theme.colors.text + '80'}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Post Content</Text>
          <TextInput
            style={[
              styles.contentInput, 
              { 
                color: theme.colors.text,
                backgroundColor: theme.dark ? '#2c2c2c' : '#f5f5f5',
                borderColor: theme.colors.border
              }
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.colors.text + '80'}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity 
          style={[
            styles.attachButton, 
            { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border
            }
          ]}
        >
          <Ionicons name="image-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.attachButtonText, { color: theme.colors.primary }]}>
            Add Photos
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={[styles.submitButton, { 
            backgroundColor: isSubmitting ? theme.colors.border : theme.colors.primary 
          }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  contentInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
  },
  attachButtonText: {
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  submitButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;
