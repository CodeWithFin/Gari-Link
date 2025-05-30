import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DURATIONS, EASINGS } from '../utils/animations';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  position?: 'top' | 'bottom';
  style?: ViewStyle;
  textStyle?: TextStyle;
  showIcon?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onDismiss,
  position = 'top',
  style,
  textStyle,
  showIcon = true,
}) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && !isVisible) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: DURATIONS.MEDIUM,
          easing: EASINGS.EASE_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: DURATIONS.MEDIUM,
          easing: EASINGS.EASE_OUT,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          handleDismiss();
        }, duration);
      }
    } else if (!visible && isVisible) {
      handleDismiss();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, isVisible, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: DURATIONS.MEDIUM,
        easing: EASINGS.EASE_IN,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: DURATIONS.MEDIUM,
        easing: EASINGS.EASE_IN,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  // Get icon name and color based on toast type
  const getIconConfig = (): { name: string; color: string } => {
    switch (type) {
      case 'success':
        return { 
          name: 'checkmark-circle', 
          color: theme.colors.success 
        };
      case 'error':
        return { 
          name: 'close-circle', 
          color: theme.colors.error 
        };
      case 'warning':
        return { 
          name: 'warning', 
          color: theme.colors.warning 
        };
      case 'info':
      default:
        return { 
          name: 'information-circle', 
          color: theme.colors.info 
        };
    }
  };

  // Get toast background color based on type
  const getBackgroundColor = (): string => {
    const alpha = theme.dark ? '22' : '15'; // hex opacity
    switch (type) {
      case 'success':
        return theme.dark 
          ? `${theme.colors.success}${alpha}`
          : `${theme.colors.success}${alpha}`;
      case 'error':
        return theme.dark 
          ? `${theme.colors.error}${alpha}`
          : `${theme.colors.error}${alpha}`;
      case 'warning':
        return theme.dark 
          ? `${theme.colors.warning}${alpha}`
          : `${theme.colors.warning}${alpha}`;
      case 'info':
      default:
        return theme.dark 
          ? `${theme.colors.info}${alpha}`
          : `${theme.colors.info}${alpha}`;
    }
  };

  // Get border color based on type
  const getBorderColor = (): string => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  };

  const { name: iconName, color: iconColor } = getIconConfig();

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          transform: [{ translateY }],
          opacity,
          ...Platform.select({
            ios: {
              shadowColor: theme.dark ? '#000' : getBorderColor(),
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            },
            android: {
              elevation: theme.elevation.medium,
            },
          }),
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {showIcon && (
          <Ionicons
            name={iconName}
            size={24}
            color={iconColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.message,
            { 
              color: theme.colors.text,
              fontFamily: theme.fonts.medium.fontFamily,
              fontWeight: theme.fonts.medium.fontWeight,
            },
            textStyle,
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleDismiss}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Ionicons
          name="close"
          size={18}
          color={theme.colors.text}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 9999,
  },
  topPosition: {
    top: Platform.OS === 'ios' ? 50 : 30,
  },
  bottomPosition: {
    bottom: Platform.OS === 'ios' ? 50 : 30,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default Toast;
