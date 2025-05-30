import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Text,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { DURATIONS, EASINGS } from '../utils/animations';

export interface FABAction {
  icon: string;
  name: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  icon?: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft';
  style?: ViewStyle;
  visible?: boolean;
  size?: 'small' | 'medium' | 'large';
  label?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions = [],
  icon = 'add',
  color,
  backgroundColor,
  onPress,
  position = 'bottomRight',
  style,
  visible = true,
  size = 'medium',
  label,
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0)).current;
  
  // Handle visibility changes
  React.useEffect(() => {
    Animated.timing(scale, {
      toValue: visible ? 1 : 0,
      duration: DURATIONS.MEDIUM,
      easing: EASINGS.EASE_IN_OUT,
      useNativeDriver: true,
    }).start();
  }, [visible, scale]);

  const toggleMenu = () => {
    if (actions.length === 0 && onPress) {
      onPress();
      return;
    }
    
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const buttonSize = {
    small: 40,
    medium: 56,
    large: 64,
  }[size];
  
  const iconSize = {
    small: 20,
    medium: 24,
    large: 28,
  }[size];

  const getPositionStyle = (): ViewStyle => {
    switch (position) {
      case 'bottomRight':
        return {
          bottom: 16,
          right: 16,
        };
      case 'bottomLeft':
        return {
          bottom: 16,
          left: 16,
        };
      case 'topRight':
        return {
          top: 16,
          right: 16,
        };
      case 'topLeft':
        return {
          top: 16,
          left: 16,
        };
      default:
        return {
          bottom: 16,
          right: 16,
        };
    }
  };

  const renderActions = () => {
    if (actions.length === 0) return null;
    
    return actions.map((action, index) => {
      const actionTranslation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -1 * (index + 1) * (buttonSize * 1.2)],
      });

      const actionOpacity = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
      });

      const actionScale = animation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
      });

      const actionRotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['90deg', '0deg'],
      });

      return (
        <Animated.View
          key={index}
          style={[
            styles.actionContainer,
            {
              transform: [
                { translateY: actionTranslation },
                { scale: actionScale },
                { rotate: actionRotation },
              ],
              opacity: actionOpacity,
            },
          ]}
        >
          {action.name && (
            <Animated.View
              style={[
                styles.labelContainer,
                {
                  backgroundColor: theme.colors.card,
                  opacity: actionOpacity,
                  transform: [{ scale: actionScale }],
                  ...Platform.select({
                    ios: {
                      shadowColor: theme.dark ? '#000' : theme.colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 3,
                    },
                    android: {
                      elevation: 3,
                    },
                  }),
                },
              ]}
            >
              <Text
                style={[
                  styles.labelText,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.fonts.medium.fontFamily,
                    fontWeight: theme.fonts.medium.fontWeight,
                  },
                ]}
              >
                {action.name}
              </Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: action.backgroundColor || theme.colors.secondary,
                width: buttonSize * 0.85,
                height: buttonSize * 0.85,
                ...Platform.select({
                  ios: {
                    shadowColor: theme.dark ? '#000' : action.backgroundColor || theme.colors.secondary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              },
            ]}
            onPress={() => {
              toggleMenu();
              action.onPress();
            }}
          >
            <Ionicons
              name={action.icon}
              size={iconSize * 0.85}
              color={action.color || '#FFFFFF'}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View
      style={[
        styles.container,
        getPositionStyle(),
        style,
      ]}
      pointerEvents="box-none"
    >
      {renderActions()}

      <Animated.View
        style={[
          {
            transform: [{ scale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: backgroundColor || theme.colors.primary,
              width: buttonSize,
              height: buttonSize,
              ...Platform.select({
                ios: {
                  shadowColor: theme.dark ? '#000' : backgroundColor || theme.colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 6,
                },
              }),
            },
          ]}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotation }],
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Ionicons
              name={icon}
              size={iconSize}
              color={color || '#FFFFFF'}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {label && (
        <Animated.View
          style={[
            styles.mainLabelContainer,
            {
              backgroundColor: theme.colors.card,
              opacity: scale,
              ...Platform.select({
                ios: {
                  shadowColor: theme.dark ? '#000' : theme.colors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                },
                android: {
                  elevation: 2,
                },
              }),
            },
          ]}
        >
          <Text
            style={[
              styles.labelText,
              {
                color: theme.colors.text,
                fontFamily: theme.fonts.medium.fontFamily,
                fontWeight: theme.fonts.medium.fontWeight,
              },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      )}

      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          onPress={toggleMenu}
          activeOpacity={0}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 999,
  },
  fab: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  actionButton: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  mainLabelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  labelText: {
    fontSize: 14,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'transparent',
  },
});

export default FloatingActionButton;
