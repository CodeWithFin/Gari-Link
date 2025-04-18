import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  imageUrl?: string;
  isSelected?: boolean;
  onPress: () => void;
}

export function VehicleCard({
  make,
  model,
  year,
  plateNumber,
  imageUrl,
  isSelected,
  onPress
}: VehicleCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-4">
      <Card className={`border-2 ${isSelected ? 'border-blue-500' : 'border-transparent'}`}>
        <View className="flex-row items-center">
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require('../../../assets/default-car.png')
            }
            className="w-24 h-24 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold text-gray-900">
              {make} {model}
            </Text>
            <Text className="text-gray-600">{year}</Text>
            <Text className="text-blue-600 font-medium mt-1">
              {plateNumber}
            </Text>
          </View>
          {isSelected && (
            <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-2">
              <Text className="text-white font-bold">✓</Text>
            </View>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
