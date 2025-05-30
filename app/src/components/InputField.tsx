import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  Animated,
  Platform,
  Pressable,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
  helperText?: string;
  accessibilityLabel?: string;
  floatingLabel?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  touched,
  keyboardType,
  secureTextEntry,
  multiline,
  numberOfLines,
  maxLength,
  disabled,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  required,
  helperText,
  accessibilityLabel,
  floatingLabel = true,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  
  const showError = error && touched;
  
  useEffect(() => {
    // Animate the label when value changes or focus changes
    Animated.timing(labelAnimation, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: theme.animation.duration.medium,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value, labelAnimation, theme.animation.duration.medium]);

  const labelStyle2 = {
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [floatingLabel ? 18 : 0, 0],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        showError 
          ? theme.colors.error 
          : theme.colors.textSecondary,
        showError 
          ? theme.colors.error 
          : isFocused 
            ? theme.colors.primary 
            : theme.colors.textSecondary
      ],
    }),
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(new Event('focus') as any);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(new Event('blur') as any);
    }
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const getBorderColor = () => {
    if (showError) return theme.colors.error;
    if (isFocused) return theme.colors.primary;
    return theme.colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        {floatingLabel ? (
          <Pressable onPress={handleContainerPress}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: getBorderColor(),
                  backgroundColor: disabled
                    ? theme.dark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)'
                    : theme.colors.card,
                  borderWidth: isFocused ? 2 : 1,
                },
                isFocused && styles.focusedInput,
              ]}
            >
              <Animated.Text
                style={[
                  styles.floatingLabel,
                  labelStyle2,
                  labelStyle,
                ]}
              >
                {label}
                {required && <Text style={{ color: theme.colors.error }}> *</Text>}
              </Animated.Text>

              <View style={styles.inputRow}>
                {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

                <TextInput
                  ref={inputRef}
                  style={[
                    styles.input,
                    {
                      color: theme.colors.text,
                      height: multiline ? 100 : undefined,
                      textAlignVertical: multiline ? 'top' : 'center',
                      paddingTop: multiline ? 24 : (floatingLabel ? 24 : 12),
                      paddingBottom: multiline ? 12 : 12,
                      fontFamily: theme.fonts.regular.fontFamily,
                    },
                    inputStyle,
                  ]}
                  value={value}
                  onChangeText={onChangeText}
                  placeholder={isFocused ? placeholder : ''}
                  placeholderTextColor={theme.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}
                  keyboardType={keyboardType}
                  secureTextEntry={secureTextEntry}
                  multiline={multiline}
                  numberOfLines={numberOfLines}
                  maxLength={maxLength}
                  editable={!disabled}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  accessibilityLabel={accessibilityLabel || label}
                  accessibilityHint={placeholder}
                  accessibilityState={{ disabled }}
                  selectionColor={theme.colors.primary}
                  {...props}
                />

                {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
              </View>
            </View>
          </Pressable>
        ) : (
          // Standard label (non-floating) version
          <>
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  { 
                    color: theme.colors.text,
                    fontFamily: theme.fonts.medium.fontFamily,
                    fontWeight: theme.fonts.medium.fontWeight,
                  },
                  labelStyle,
                ]}
              >
                {label}
                {required && <Text style={{ color: theme.colors.error }}> *</Text>}
              </Text>
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  borderColor: getBorderColor(),
                  backgroundColor: disabled
                    ? theme.dark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.03)'
                    : theme.colors.card,
                },
                isFocused && styles.focusedInput,
              ]}
            >
              {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  {
                    color: theme.colors.text,
                    height: multiline ? 100 : undefined,
                    textAlignVertical: multiline ? 'top' : 'center',
                    fontFamily: theme.fonts.regular.fontFamily,
                  },
                  inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                numberOfLines={numberOfLines}
                maxLength={maxLength}
                editable={!disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                accessibilityLabel={accessibilityLabel || label}
                accessibilityHint={placeholder}
                accessibilityState={{ disabled }}
                selectionColor={theme.colors.primary}
                {...props}
              />

              {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
            </View>
          </>
        )}
      </View>

      {showError ? (
        <Text
          style={[
            styles.errorText,
            { 
              color: theme.colors.error,
              fontFamily: theme.fonts.regular.fontFamily,
            },
            errorStyle,
          ]}
          accessibilityLabel={`Error: ${error}`}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            styles.helperText,
            { 
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.regular.fontFamily,
            },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputWrapper: {
    position: 'relative',
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    paddingHorizontal: 0,
    zIndex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 56,
  },
  focusedInput: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    paddingHorizontal: 12,
  },
  leftIconContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  rightIconContainer: {
    paddingRight: 16,
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default InputField;
