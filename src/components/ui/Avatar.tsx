import { Image, View, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  imageUrl?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ 
  imageUrl, 
  initials, 
  size = 'md',
  className 
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        className={twMerge(
          'rounded-full',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <View
      className={twMerge(
        'rounded-full bg-blue-100 items-center justify-center',
        sizeStyles[size],
        className
      )}
    >
      <Text className={`text-blue-600 font-medium ${textStyles[size]}`}>
        {initials?.toUpperCase() || '?'}
      </Text>
    </View>
  );
}
