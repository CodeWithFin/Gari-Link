import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { CommunityStackParamList, CommunityScreenNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type DiscussionScreenRouteProp = RouteProp<CommunityStackParamList, 'Discussion'>;

// Mock data for development
const MOCK_DISCUSSION = {
  id: '1',
  title: 'Best garages in Westlands area?',
  content: 'I recently moved to Westlands and need recommendations for reliable garages in the area. My car needs a service soon and I want to find a trustworthy place. Any suggestions would be appreciated!',
  author: 'James Kamau',
  authorId: 'user123',
  createdAt: '2023-05-26T10:30:00Z',
};

const MOCK_COMMENTS = [
  {
    id: 'c1',
    text: 'I highly recommend AutoXpress on Waiyaki Way. They\'ve been servicing my Toyota for years and are very professional.',
    author: 'Sarah Wangari',
    authorId: 'user456',
    createdAt: '2023-05-26T11:15:00Z',
    likes: 5,
  },
  {
    id: 'c2',
    text: 'Try Carzone in Westlands. A bit pricey but they do quality work and have excellent customer service.',
    author: 'Mike Omondi',
    authorId: 'user789',
    createdAt: '2023-05-26T12:45:00Z',
    likes: 3,
  },
  {
    id: 'c3',
    text: 'Avoid Speedy Motors - had a terrible experience there last month. My brakes were still squeaking after I paid for a full brake service.',
    author: 'Lucy Njeri',
    authorId: 'user101',
    createdAt: '2023-05-27T09:20:00Z',
    likes: 8,
  },
];

const DiscussionScreen: React.FC = () => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  
  const route = useRoute<DiscussionScreenRouteProp>();
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const { theme } = useTheme();
  const { discussionId } = route.params;

  // In a real app, we would fetch the discussion details using the discussionId
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: `c${comments.length + 1}`,
        text: newComment,
        author: 'Current User', // In a real app, this would be the logged-in user
        authorId: 'currentUser',
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const renderCommentItem = ({ item }: { item: typeof MOCK_COMMENTS[0] }) => (
    <View style={[styles.commentItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.commentHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile', { userId: item.authorId })}>
          <Text style={[styles.commentAuthor, { color: theme.colors.primary }]}>
            {item.author}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.commentDate, { color: theme.colors.text }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
      <Text style={[styles.commentText, { color: theme.colors.text }]}>
        {item.text}
      </Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={16} color={theme.colors.primary} />
          <Text style={[styles.likeCount, { color: theme.colors.primary }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.replyButton}>
          <Text style={[styles.replyText, { color: theme.colors.primary }]}>
            Reply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.discussionHeader, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.discussionTitle, { color: theme.colors.text }]}>
          {MOCK_DISCUSSION.title}
        </Text>
        <View style={styles.authorRow}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('UserProfile', { userId: MOCK_DISCUSSION.authorId })}
          >
            <Text style={[styles.authorName, { color: theme.colors.primary }]}>
              {MOCK_DISCUSSION.author}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.postDate, { color: theme.colors.text }]}>
            {formatDate(MOCK_DISCUSSION.createdAt)}
          </Text>
        </View>
        <Text style={[styles.discussionContent, { color: theme.colors.text }]}>
          {MOCK_DISCUSSION.content}
        </Text>
      </View>

      <View style={styles.commentsHeader}>
        <Text style={[styles.commentsTitle, { color: theme.colors.text }]}>
          Responses ({comments.length})
        </Text>
      </View>

      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme.colors.card }]}>
        <TextInput
          style={[styles.input, { 
            color: theme.colors.text,
            backgroundColor: theme.dark ? '#2c2c2c' : '#f5f5f5',
          }]}
          placeholder="Add a comment..."
          placeholderTextColor={theme.colors.text + '80'}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { 
            backgroundColor: newComment.trim() ? theme.colors.primary : theme.colors.border,
          }]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  discussionHeader: {
    padding: 16,
  },
  discussionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  postDate: {
    fontSize: 12,
  },
  discussionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  commentItem: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 12,
  },
  replyButton: {},
  replyText: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiscussionScreen;
