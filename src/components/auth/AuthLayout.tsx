import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </Text>
            {subtitle && (
              <Text className="text-gray-600 text-base">
                {subtitle}
              </Text>
            )}
          </View>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
