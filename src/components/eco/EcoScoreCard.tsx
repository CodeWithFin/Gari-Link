import { View, Text } from 'react-native';
import { Card } from '../ui/Card';

interface EcoScoreCardProps {
  score: number;
  metrics: {
    label: string;
    value: number;
    unit: string;
    trend?: {
      value: number;
      isPositive: boolean;
    };
  }[];
  tips?: string[];
}

export function EcoScoreCard({
  score,
  metrics,
  tips
}: EcoScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card>
      <View className="items-center mb-4">
        <View className={`px-4 py-2 rounded-full ${getScoreColor(score)}`}>
          <Text className="text-2xl font-bold">
            {score}/100
          </Text>
        </View>
      </View>

      <View className="space-y-3">
        {metrics.map((metric, index) => (
          <View key={index} className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-600">{metric.label}</Text>
              <Text className="text-lg font-medium">
                {metric.value} {metric.unit}
              </Text>
            </View>
            {metric.trend && (
              <View 
                className={`px-2 py-1 rounded ${
                  metric.trend.isPositive ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Text 
                  className={`text-sm font-medium ${
                    metric.trend.isPositive ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {metric.trend.isPositive ? '↑' : '↓'} {Math.abs(metric.trend.value)}%
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {tips && tips.length > 0 && (
        <View className="mt-4 pt-4 border-t border-gray-100">
          <Text className="font-semibold text-gray-900 mb-2">
            Improvement Tips
          </Text>
          {tips.map((tip, index) => (
            <View key={index} className="flex-row mb-2 last:mb-0">
              <Text className="text-green-600 mr-2">•</Text>
              <Text className="text-gray-600 flex-1">{tip}</Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
