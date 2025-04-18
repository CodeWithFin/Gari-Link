import { View, Text, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';

interface DocumentCardProps {
  title: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  fileSize: string;
  onPress: () => void;
  onDelete?: () => void;
}

export function DocumentCard({
  title,
  type,
  uploadDate,
  expiryDate,
  fileSize,
  onPress,
  onDelete
}: DocumentCardProps) {
  const isExpiringSoon = expiryDate && new Date(expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card className="mb-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <Text className="text-gray-600 text-sm">{type}</Text>
          </View>
          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              className="p-2"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text className="text-red-500">Delete</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row justify-between mt-2">
          <View>
            <Text className="text-gray-600 text-sm">Uploaded</Text>
            <Text className="font-medium">{uploadDate}</Text>
          </View>
          <View>
            <Text className="text-gray-600 text-sm">Size</Text>
            <Text className="font-medium">{fileSize}</Text>
          </View>
        </View>

        {expiryDate && (
          <View className="mt-2 pt-2 border-t border-gray-100">
            <Text className="text-gray-600 text-sm">Expires</Text>
            <Text className={`font-medium ${isExpiringSoon ? 'text-red-600' : 'text-gray-900'}`}>
              {expiryDate}
              {isExpiringSoon && ' (Expiring Soon)'}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}
