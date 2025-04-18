import { useEffect } from 'react';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/auth.store';

const queryClient = new QueryClient();

// Prevent access to protected routes when not authenticated
function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!loading) {
      if (!user && !inAuthGroup) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else if (user && inAuthGroup) {
        // Redirect to home if authenticated and trying to access auth screens
        router.replace('/');
      }
    }
  }, [user, loading, segments]);
}

export default function RootLayout() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, []);

  useProtectedRoute();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="(auth)/login"
            options={{
              title: 'Sign In',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/register"
            options={{
              title: 'Create Account',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              title: 'GariLink',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
