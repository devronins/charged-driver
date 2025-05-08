import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RideModal } from '@/utils/modals/ride';

interface RideBottomSheetProps {
  ride: RideModal;
  onStartRide: () => void;
  onChat: () => void;
  isVisible: boolean;
}

const RideDetailsBottomSheet = ({
  ride,
  onStartRide,
  onChat,
  isVisible = true,
}: RideBottomSheetProps) => {
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['10%', '20%', '40%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 1 : 0} // Use 0 instead of -1 to keep 20% always visible
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false} // Disable pan down to close
      handleIndicatorStyle={{ backgroundColor: '#A0AEC0', width: 40 }}
    >
      <BottomSheetView>
        <View className="px-5 pt-2 bg-white rounded-t-3xl">
          {/* Header */}
          <Text className="text-lg font-bold text-neutral-800 mb-4">Ride Details</Text>

          {/* Info Rows */}
          <View className="space-y-4">
            {/* Pickup */}
            <View className="flex-row items-start">
              <View className="h-10 w-10 bg-green-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="location" size={18} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Pickup</Text>
                <Text className="text-base text-gray-800">{ride.pickup_address}</Text>
              </View>
            </View>

            {/* Dropoff */}
            <View className="flex-row items-start">
              <View className="h-10 w-10 bg-red-100 rounded-full justify-center items-center mr-3">
                <Ionicons name="location-outline" size={18} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-500">Dropoff</Text>
                <Text className="text-base text-gray-800">{ride.dropoff_address}</Text>
              </View>
            </View>

            {/* Summary Grid */}
            <View className="flex-row justify-between mt-2 px-1">
              <View>
                <Text className="text-sm text-gray-500">Distance</Text>
                <Text className="text-base font-semibold text-gray-800">{ride.distance_km} km</Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Duration</Text>
                <Text className="text-base font-semibold text-gray-800">
                  {ride.duration_minutes} mins
                </Text>
              </View>
              <View>
                <Text className="text-sm text-gray-500">Fare</Text>
                <Text className="text-base font-semibold text-green-600">₹{ride.total_fare}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-6 mb-6">
            {/* Start Ride Button */}
            <TouchableOpacity
              onPress={onStartRide}
              className="flex-1 bg-green-600 py-3 rounded-full flex-row justify-center items-center mr-2 shadow-lg"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text className="text-white text-base font-semibold ml-2">Start Ride</Text>
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity
              onPress={onChat}
              className="w-12 h-12 bg-blue-600 rounded-full justify-center items-center shadow-lg"
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default RideDetailsBottomSheet;
