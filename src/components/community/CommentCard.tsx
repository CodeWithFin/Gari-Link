import { View, Text } from 'react-native';
import { Avatar } from '../ui/Avatar';

interface CommentCardProps {
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  likes?: number;
  isReply?: boolean;
}

export function CommentCard({
  author,
  content,
  timestamp,
  likes,
  isReply = false
}: CommentCardProps) {
  return (
    <View className={`mb-4 ${isReply ? 'ml-12' : ''}`}>
      <View className="flex-row">
        <Avatar
          imageUrl={author.avatarUrl}
          initials={author.name.substring(0, 2)}
          size="sm"
        />
        <View className="flex-1 ml-2">
          <View className="bg-gray-100 rounded-2xl p-3">
            <Text className="font-semibold text-gray-900 mb-1">
              {author.name}
            </Text>
            <Text className="text-gray-800">{content}</Text>
          </View>
          <View className="flex-row items-center mt-1 space-x-4">
            <Text className="text-gray-500 text-xs">{timestamp}</Text>
            {likes !== undefined && (
              <Text className="text-gray-500 text-xs">
                {likes} {likes === 1 ? 'like' : 'likes'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
