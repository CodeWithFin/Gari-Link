import { View, Text, Image } from 'react-native';
import { Card } from '../ui/Card';

interface AchievementCardProps {
  title: string;
  description: string;
  points: number;
  iconUrl: string;
  progress?: {
    current: number;
    total: number;
  };
  unlocked: boolean;
  unlockedDate?: string;
}

export function AchievementCard({
  title,
  description,
  points,
  iconUrl,
  progress,
  unlocked,
  unlockedDate
}: AchievementCardProps) {
  return (
    <Card className={`mb-4 ${!unlocked ? 'opacity-70' : ''}`}>
      <View className="flex-row">
        <Image
          source={{ uri: iconUrl }}
          className="w-12 h-12 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-semibold text-gray-900">{title}</Text>
            <View className="bg-yellow-100 px-2 py-1 rounded">
              <Text className="text-yellow-800 text-sm font-medium">
                {points} pts
              </Text>
            </View>
          </View>
          <Text className="text-gray-600 mt-1">{description}</Text>
        </View>
      </View>

      {progress && (
        <View className="mt-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600 text-sm">
              Progress: {progress.current}/{progress.total}
            </Text>
            <Text className="text-gray-600 text-sm">
              {Math.round((progress.current / progress.total) * 100)}%
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{
                width: `${(progress.current / progress.total) * 100}%`
              }}
            />
          </View>
        </View>
      )}

      {unlocked && unlockedDate && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-green-600 text-sm">
            🏆 Unlocked on {unlockedDate}
          </Text>
        </View>
      )}
    </Card>
  );
}
