import { Text, TouchableOpacity } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  className,
  disabled = false 
}: ButtonProps) {
  const baseStyles = 'px-4 py-3 rounded-lg flex-row items-center justify-center';
  const variantStyles = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 active:bg-gray-300'
  };
  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-gray-800 font-semibold'
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        disabled && 'opacity-50',
        className
      )}
    >
      <Text className={textStyles[variant]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
