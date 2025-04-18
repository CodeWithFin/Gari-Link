import { View, Text } from 'react-native';
import { Card } from '../ui/Card';

interface TripCardProps {
  startLocation: string;
  endLocation: string;
  date: string;
  distance: number;
  duration: string;
  fuelConsumption?: number;
  purpose?: string;
}

export function TripCard({
  startLocation,
  endLocation,
  date,
  distance,
  duration,
  fuelConsumption,
  purpose
}: TripCardProps) {
  return (
    <Card className="mb-4">
      <View className="mb-3">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-green-500" />
          <Text className="text-gray-900 font-medium ml-2 flex-1">
            {startLocation}
          </Text>
        </View>
        <View className="w-0.5 h-4 bg-gray-200 ml-1" />
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-red-500" />
          <Text className="text-gray-900 font-medium ml-2 flex-1">
            {endLocation}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-gray-600 text-sm">Date</Text>
          <Text className="font-medium">{date}</Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Distance</Text>
          <Text className="font-medium">{distance.toFixed(1)} km</Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Duration</Text>
          <Text className="font-medium">{duration}</Text>
        </View>
      </View>

      {(fuelConsumption || purpose) && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          {fuelConsumption && (
            <View className="mb-1">
              <Text className="text-gray-600 text-sm">Fuel Consumption</Text>
              <Text className="font-medium">{fuelConsumption.toFixed(2)} L</Text>
            </View>
          )}
          {purpose && (
            <View>
              <Text className="text-gray-600 text-sm">Purpose</Text>
              <Text className="font-medium">{purpose}</Text>
            </View>
          )}
        </View>
      )}
    </Card>
  );
}
