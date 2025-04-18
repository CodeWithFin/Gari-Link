import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await login(data);
  });

  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <View className="space-y-6">
        <View>
          <Text className="text-3xl font-bold text-center text-gray-800">Welcome Back</Text>
          <Text className="text-center text-gray-600 mt-2">Sign in to your account</Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            className="w-full h-12 bg-primary rounded-lg items-center justify-center"
            onPress={onSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center space-x-1">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/register" className="text-primary font-semibold">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
}
