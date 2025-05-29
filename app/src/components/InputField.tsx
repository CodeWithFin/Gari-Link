import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
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
  ...props
}) => {
  const { theme } = useTheme();

  const showError = error && touched;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.text },
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
            borderColor: showError
              ? theme.colors.error
              : disabled
              ? theme.colors.border
              : theme.colors.border,
            backgroundColor: disabled
              ? theme.dark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)'
              : theme.colors.card,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              height: multiline ? 100 : undefined,
              textAlignVertical: multiline ? 'top' : 'center',
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
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={placeholder}
          accessibilityState={{ disabled }}
          {...props}
        />

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {showError ? (
        <Text
          style={[
            styles.errorText,
            { color: theme.colors.error },
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
            { color: theme.dark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' },
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
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
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
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default InputField;
