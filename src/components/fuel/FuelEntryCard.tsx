import { View, Text } from 'react-native';
import { Card } from '../ui/Card';

interface FuelEntryCardProps {
  date: string;
  liters: number;
  cost: number;
  mileage: number;
  fuelType: string;
  efficiency?: number;
}

export function FuelEntryCard({
  date,
  liters,
  cost,
  mileage,
  fuelType,
  efficiency
}: FuelEntryCardProps) {
  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-gray-900">{date}</Text>
        <View className="bg-blue-100 px-2 py-1 rounded">
          <Text className="text-blue-800 text-sm font-medium">{fuelType}</Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-gray-600 text-sm">Amount</Text>
          <Text className="font-medium">{liters.toFixed(2)}L</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 text-sm">Cost</Text>
          <Text className="font-medium">KES {cost.toLocaleString()}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-gray-600 text-sm">Mileage</Text>
          <Text className="font-medium">{mileage.toLocaleString()} km</Text>
        </View>
      </View>

      {efficiency && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-gray-600 text-sm">Efficiency</Text>
          <Text className="font-medium text-green-600">
            {efficiency.toFixed(2)} km/L
          </Text>
        </View>
      )}
    </Card>
  );
}
