import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';

interface ScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ScreenLayout({ children, className }: ScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className={twMerge('flex-1 px-4', className)}>
        {children}
      </View>
    </SafeAreaView>
  );
}
