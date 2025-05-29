import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps
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
  
  // Define button styles based on type
  const getButtonStyles = (): ViewStyle => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? theme.colors.border : theme.colors.secondary,
          borderWidth: 0,
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
        };
      case 'secondary':
        return {
          color: theme.dark ? '#000000' : '#1D3557',
        };
      case 'outline':
        return {
          color: disabled ? theme.colors.border : theme.colors.primary,
        };
      case 'text':
        return {
          color: disabled ? theme.colors.border : theme.colors.primary,
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
          paddingVertical: 6,
          paddingHorizontal: 12,
        };
      case 'medium':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
        };
      case 'large':
        return {
          paddingVertical: 14,
          paddingHorizontal: 20,
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
          fontSize: 12,
        };
      case 'medium':
        return {
          fontSize: 14,
        };
      case 'large':
        return {
          fontSize: 16,
        };
      default:
        return {};
    }
  };
  
  return (
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
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={type === 'outline' || type === 'text' ? theme.colors.primary : '#FFFFFF'} 
        />
      ) : (
        <>
          {leftIcon}
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
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 80,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },
});

export default Button;
