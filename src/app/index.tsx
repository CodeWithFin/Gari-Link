import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const { user, logout } = useAuthStore();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Header */}
        <View className="items-center py-8">
          <Text className="text-3xl font-bold text-gray-800">GariLink</Text>
          <Text className="text-gray-600 mt-2">Your car maintenance companion</Text>
        </View>

        {/* User Info */}
        {user && (
          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <Text className="text-gray-600">Welcome back,</Text>
            <Text className="text-lg font-semibold text-gray-800 mt-1">
              {user.user_metadata?.display_name || user.email}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View className="space-y-4">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Quick Actions</Text>
          
          <TouchableOpacity className="bg-primary p-4 rounded-lg">
            <Text className="text-white font-semibold text-lg">Schedule Service</Text>
            <Text className="text-white opacity-80 mt-1">Book your next maintenance service</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-800 p-4 rounded-lg">
            <Text className="text-white font-semibold text-lg">Service History</Text>
            <Text className="text-white opacity-80 mt-1">View your maintenance records</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-primary/10 p-4 rounded-lg">
            <Text className="text-primary font-semibold text-lg">Find Mechanic</Text>
            <Text className="text-gray-600 mt-1">Locate trusted mechanics near you</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        {user && (
          <TouchableOpacity
            className="mt-8 bg-red-500 p-4 rounded-lg items-center"
            onPress={logout}
          >
            <Text className="text-white font-semibold">Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
