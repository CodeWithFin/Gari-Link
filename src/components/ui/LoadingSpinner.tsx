import { ActivityIndicator, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = 'large',
  color = '#3b82f6', // blue-500
  className 
}: LoadingSpinnerProps) {
  return (
    <View className={twMerge('flex-1 justify-center items-center', className)}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
