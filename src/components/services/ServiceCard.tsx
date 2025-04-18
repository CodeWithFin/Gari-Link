import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Card } from '../ui/Card';

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price?: string;
  onPress: () => void;
}

export function ServiceCard({
  title,
  description,
  imageUrl,
  price,
  onPress
}: ServiceCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mb-4">
      <Card>
        <View className="flex-row">
          <Image
            source={{ uri: imageUrl }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
              {description}
            </Text>
            {price && (
              <Text className="text-blue-600 font-semibold mt-2">
                KES {price}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
