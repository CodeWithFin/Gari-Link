import { View, Text } from 'react-native';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  trend
}: StatCardProps) {
  return (
    <Card className="mb-4">
      <Text className="text-gray-600 text-sm mb-1">{title}</Text>
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">{value}</Text>
          {subtitle && (
            <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
          )}
        </View>
        {trend && (
          <View 
            className={`px-2 py-1 rounded ${
              trend.isPositive ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Text 
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}
