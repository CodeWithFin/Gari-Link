import { View, ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={twMerge(
        'bg-white rounded-xl p-4 shadow-sm border border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
