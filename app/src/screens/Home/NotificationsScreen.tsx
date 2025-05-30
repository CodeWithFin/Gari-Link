import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Notification } from '../../types/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../../utils/helpers';

// Storage key
const NOTIFICATIONS_STORAGE_KEY = '@garilink:notifications';

const NotificationsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      
      if (data) {
        const allNotifications: Notification[] = JSON.parse(data);
        const userNotifications = allNotifications
          .filter(notification => notification.userId === user.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setNotifications(userNotifications);
      } else {
        // For demo purposes, create some mock notifications
        const mockNotifications = generateMockNotifications(user.id);
        await AsyncStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(mockNotifications)
        );
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Get the notification title for the toast message
      const notification = notifications.find(n => n.id === notificationId);
      
      // If already read, no need to do anything
      if (notification?.read) {
        return;
      }
      
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      );
      
      setNotifications(updatedNotifications);
      
      const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        const allNotifications: Notification[] = JSON.parse(data);
        const updated = allNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        );
        
        await AsyncStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(updated)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast({
        message: "Failed to mark notification as read",
        type: "error",
        duration: 2000,
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadCount = notifications.filter(n => !n.read).length;
      if (unreadCount === 0) {
        showToast({
          message: "No unread notifications to mark as read",
          type: "info",
          duration: 2000,
        });
        return;
      }
      
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      
      setNotifications(updatedNotifications);
      
      const data = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        const allNotifications: Notification[] = JSON.parse(data);
        const updated = allNotifications.map(notification =>
          notification.userId === user?.id
            ? { ...notification, read: true }
            : notification
        );
        
        await AsyncStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(updated)
        );
        
        showToast({
          message: `Marked ${unreadCount} notification${unreadCount > 1 ? 's' : ''} as read`,
          type: "success",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      showToast({
        message: "Failed to mark notifications as read",
        type: "error",
        duration: 3000,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadNotifications();
      showToast({
        message: "Notifications refreshed",
        type: "info",
        duration: 1500,
      });
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      showToast({
        message: "Failed to refresh notifications",
        type: "error",
        duration: 2000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.warning }]}>
            <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
          </View>
        );
      case 'community':
        return (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.info }]}>
            <Ionicons name="people" size={20} color="#FFFFFF" />
          </View>
        );
      case 'system':
        return (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="information-circle" size={20} color="#FFFFFF" />
          </View>
        );
      case 'review':
        return (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.success }]}>
            <Ionicons name="star" size={20} color="#FFFFFF" />
          </View>
        );
      default:
        return (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="notifications" size={20} color="#FFFFFF" />
          </View>
        );
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? theme.colors.card : theme.dark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        },
      ]}
      onPress={() => markAsRead(item.id)}
      accessibilityLabel={`Notification: ${item.title}`}
    >
      {renderNotificationIcon(item.type)}
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationTitle,
            { color: theme.colors.text },
            !item.read && styles.unreadText,
          ]}
        >
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.colors.text }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.text }]}>
          {formatNotificationTime(new Date(item.createdAt))}
        </Text>
      </View>
      {!item.read && (
        <View
          style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]}
        />
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        Notifications
      </Text>
      {notifications.some(notification => !notification.read) && (
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={markAllAsRead}
          accessibilityLabel="Mark all as read"
        >
          <Text style={{ color: theme.colors.primary }}>Mark all as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="notifications-outline"
        size={64}
        color={theme.colors.text}
        style={{ opacity: 0.5 }}
      />
      <Text style={[styles.emptyText, { color: theme.colors.text }]}>
        No notifications yet
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.colors.text }]}>
        We'll notify you about important updates and maintenance reminders
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          notifications.length === 0 && styles.emptyListContent,
        ]}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const formatNotificationTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than a minute
  if (diff < 60 * 1000) {
    return 'Just now';
  }
  
  // Less than an hour
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a day
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  }
  
  // Less than a week
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
  
  // Format as date
  return date.toLocaleDateString();
};

const generateMockNotifications = (userId: string): Notification[] => {
  const now = new Date();
  
  return [
    {
      id: generateId(),
      userId,
      type: 'reminder',
      title: 'Oil Change Due',
      message: 'Your Toyota Corolla is due for an oil change. Schedule service soon.',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
    },
    {
      id: generateId(),
      userId,
      type: 'community',
      title: 'New Reply',
      message: 'John replied to your post in Toyota Owners Group',
      createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000), // 12 hours ago
      read: false,
    },
    {
      id: generateId(),
      userId,
      type: 'system',
      title: 'Welcome to GariLink',
      message: 'Thank you for joining GariLink! Start by adding your vehicle.',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
    },
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  markAllButton: {
    padding: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: '80%',
  },
});

export default NotificationsScreen;
