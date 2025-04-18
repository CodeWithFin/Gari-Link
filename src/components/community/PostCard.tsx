import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

interface PostCardProps {
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  timestamp: string;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  isLiked?: boolean;
}

export function PostCard({
  author,
  content,
  images,
  likes,
  comments,
  timestamp,
  onLike,
  onComment,
  onShare,
  isLiked
}: PostCardProps) {
  return (
    <Card className="mb-4">
      <View className="flex-row items-center mb-3">
        <Avatar
          imageUrl={author.avatarUrl}
          initials={author.name.substring(0, 2)}
          size="sm"
        />
        <View className="ml-2">
          <Text className="font-semibold text-gray-900">{author.name}</Text>
          <Text className="text-gray-500 text-xs">{timestamp}</Text>
        </View>
      </View>

      <Text className="text-gray-800 mb-3">{content}</Text>

      {images && images.length > 0 && (
        <View className="mb-3">
          {images.length === 1 ? (
            <Image
              source={{ uri: images[0] }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-row flex-wrap -mx-1">
              {images.slice(0, 4).map((image, index) => (
                <View
                  key={index}
                  className="w-1/2 aspect-square p-1"
                >
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full rounded-lg"
                    resizeMode="cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <View className="absolute inset-1 bg-black/50 rounded-lg items-center justify-center">
                      <Text className="text-white font-semibold text-xl">
                        +{images.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
        <TouchableOpacity
          onPress={onLike}
          className="flex-row items-center"
        >
          <Text className={`text-lg mr-1 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
            ♥
          </Text>
          <Text className="text-gray-600">{likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onComment}
          className="flex-row items-center"
        >
          <Text className="text-lg mr-1 text-gray-400">💬</Text>
          <Text className="text-gray-600">{comments}</Text>
        </TouchableOpacity>

        {onShare && (
          <TouchableOpacity
            onPress={onShare}
            className="flex-row items-center"
          >
            <Text className="text-lg mr-1 text-gray-400">↗</Text>
            <Text className="text-gray-600">Share</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );
}
