import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, loading, error } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const { confirm_password, ...credentials } = data;
    await register(credentials);
  });

  return (
    <View className="flex-1 bg-white p-4 justify-center">
      <View className="space-y-6">
        <View>
          <Text className="text-3xl font-bold text-center text-gray-800">Create Account</Text>
          <Text className="text-center text-gray-600 mt-2">Sign up to get started</Text>
        </View>

        {error && (
          <View className="bg-red-50 p-4 rounded-lg">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        )}

        <View className="space-y-4">
          <Controller
            control={control}
            name="display_name"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                  placeholder="Full Name"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.display_name && (
                  <Text className="text-red-500 text-sm mt-1">{errors.display_name.message}</Text>
                )}
              </View>
            )}
          />

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

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <View>
                <TextInput
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg"
                  placeholder="Confirm Password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.confirm_password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</Text>
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
              <Text className="text-white font-semibold">Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center space-x-1">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/login" className="text-primary font-semibold">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}
