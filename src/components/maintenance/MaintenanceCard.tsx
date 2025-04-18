import { View, Text } from 'react-native';
import { Card } from '../ui/Card';

interface MaintenanceCardProps {
  title: string;
  date: string;
  mileage: number;
  cost: number;
  status: 'completed' | 'scheduled' | 'overdue';
  notes?: string;
}

export function MaintenanceCard({
  title,
  date,
  mileage,
  cost,
  status,
  notes
}: MaintenanceCardProps) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800'
  };

  return (
    <Card className="mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        <View className={`px-2 py-1 rounded ${statusColors[status]}`}>
          <Text className="text-sm font-medium capitalize">{status}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-gray-600 text-sm">Date</Text>
          <Text className="font-medium">{date}</Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Mileage</Text>
          <Text className="font-medium">{mileage.toLocaleString()} km</Text>
        </View>
        <View>
          <Text className="text-gray-600 text-sm">Cost</Text>
          <Text className="font-medium">KES {cost.toLocaleString()}</Text>
        </View>
      </View>

      {notes && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-gray-600">{notes}</Text>
        </View>
      )}
    </Card>
  );
}
