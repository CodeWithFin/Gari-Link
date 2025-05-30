import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  Animated,
  Platform,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  ...props
}) => {
  const { theme } = useTheme();
  const [scale] = useState(new Animated.Value(1));
  
  // Animation for button press
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: theme.animation.duration.short,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: theme.animation.duration.short,
      useNativeDriver: true,
    }).start();
  };
  
  // Define button styles based on type
  const getButtonStyles = (): ViewStyle => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.colors.textSecondary : theme.colors.primary,
          borderWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: theme.elevation.small,
            },
          }),
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? theme.colors.textSecondary : theme.colors.secondary,
          borderWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: theme.colors.secondary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: theme.elevation.small,
            },
          }),
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: disabled ? theme.colors.border : theme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingHorizontal: 0,
        };
      default:
        return {};
    }
  };
  
  // Define text styles based on type
  const getTextStyles = (): TextStyle => {
    switch (type) {
      case 'primary':
        return {
          color: '#FFFFFF',
          fontFamily: theme.fonts.medium.fontFamily,
          fontWeight: theme.fonts.medium.fontWeight,
        };
      case 'secondary':
        return {
          color: theme.dark ? '#000000' : '#1D3557',
          fontFamily: theme.fonts.medium.fontFamily,
          fontWeight: theme.fonts.medium.fontWeight,
        };
      case 'outline':
        return {
          color: disabled ? theme.colors.textSecondary : theme.colors.primary,
          fontFamily: theme.fonts.medium.fontFamily,
          fontWeight: theme.fonts.medium.fontWeight,
        };
      case 'text':
        return {
          color: disabled ? theme.colors.textSecondary : theme.colors.primary,
          fontFamily: theme.fonts.medium.fontFamily,
          fontWeight: theme.fonts.medium.fontWeight,
        };
      default:
        return {};
    }
  };
  
  // Define size styles
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.m,
          borderRadius: 8,
          minHeight: 36,
        };
      case 'medium':
        return {
          paddingVertical: theme.spacing.s,
          paddingHorizontal: theme.spacing.l,
          borderRadius: 10,
          minHeight: 44,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.m,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: 12,
          minHeight: 52,
        };
      default:
        return {};
    }
  };
  
  // Define text size styles
  const getTextSizeStyles = (): TextStyle => {
    switch (size) {
      case 'small':
        return {
          fontSize: 14,
        };
      case 'medium':
        return {
          fontSize: 16,
        };
      case 'large':
        return {
          fontSize: 18,
          letterSpacing: 0.5,
        };
      default:
        return {};
    }
  };
  
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[
          styles.button,
          getButtonStyles(),
          getSizeStyles(),
          style,
        ]}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || isLoading }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={type === 'outline' || type === 'text' ? theme.colors.primary : '#FFFFFF'} 
          />
        ) : (
          <View style={styles.content}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <Text 
              style={[
                styles.text, 
                getTextStyles(), 
                getTextSizeStyles(),
                textStyle
              ]}
            >
              {title}
            </Text>
            {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 80,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button;
