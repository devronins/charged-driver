import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useEarnings } from './hooks/use-earnings';
import { EarningsItem } from './components/earning-card';

const Earnings = () => {
  const {
    timeRangeOptions,
    selectedTimeRange,
    setSelectedTimeRange,
    refreshing,
    onRefresh,
    filteredEarnings,
  } = useEarnings();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-white rounded-xl p-5 m-4 shadow-sm">
          <Text className="text-base text-gray-500 mb-1">{selectedTimeRange.title}</Text>
          <Text className="text-4xl font-bold text-primary-300 mb-5">
            CAD {filteredEarnings.total.toFixed(2)}
          </Text>

          <View className="flex-row justify-between mb-6">
            {timeRangeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`px-3 py-1.5 rounded-full ${
                  selectedTimeRange.value === option.value ? 'bg-blue-100' : ''
                }`}
                onPress={() => setSelectedTimeRange(option)}
              >
                <Text
                  className={`text-sm ${
                    selectedTimeRange.value === option.value
                      ? 'text-primary-300 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row items-center pt-4 border-t border-gray-200">
            <View className="w-1/2 flex items-center justify-center border-r border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                {filteredEarnings.rides.length}
              </Text>
              <Text className="text-xs text-gray-500">Rides</Text>
            </View>

            <View className="w-1/2 flex items-center justify-center ">
              <Text className="text-lg font-bold text-gray-800">
                CAD {(filteredEarnings.total / (filteredEarnings.rides.length || 1)).toFixed(2)}
              </Text>
              <Text className="text-xs text-gray-500">Avg / Ride</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mx-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Earnings History</Text>
          <FlatList
            data={filteredEarnings.rides}
            renderItem={({ item }) => (
              <EarningsItem date={item.created_at} fare={Number(item.driver_earnings)} />
            )}
            scrollEnabled={false}
            ListEmptyComponent={
              <View className="flex items-center justify-center pt-4">
                <Text className="mt-2 text-base text-gray-500 text-center">
                  No earnings found for the selected period.
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Earnings;
