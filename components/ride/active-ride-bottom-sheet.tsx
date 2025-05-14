import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { RideModal, RideStatus } from '@/utils/modals/ride';
import { useRouter } from 'expo-router';

interface RideBottomSheetProps {
  ride: RideModal;
  onChnageRideStatus: (status: RideStatus) => void;
  onChat: () => void;
  isVisible: boolean;
}

const RideDetailsBottomSheet = ({
  ride,
  onChnageRideStatus,
  onChat,
  isVisible = true,
}: RideBottomSheetProps) => {
  const navigate = useRouter();
  // ref
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ['10%', '20%', '45%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 3 : 0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={false} // Disable pan down to close
      handleIndicatorStyle={{ backgroundColor: '#A0AEC0', width: 40 }}
    >
      <BottomSheetView className="px-5 pt-2 bg-white rounded-t-3xl">
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
              <Text className="text-base font-semibold text-green-600">CAD {ride.total_fare}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {ride.status === RideStatus.Started ? (
          <View className="flex-row justify-between mt-6 mb-6">
            {/* Start Ride Button */}
            <TouchableOpacity
              onPress={() => onChnageRideStatus(RideStatus.Completed)}
              className="flex-1 bg-tertiary-300 py-3 rounded-full flex-row justify-center items-center mr-2"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text className="text-white text-base font-semibold ml-2">Complete Ride</Text>
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity
              onPress={onChat}
              className="w-12 h-12 bg-primary-300 rounded-full justify-center items-center"
            >
              <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-between mt-6 gap-5">
            {/* Start Ride Button */}
            <TouchableOpacity
              onPress={() => onChnageRideStatus(RideStatus.Started)}
              className="flex-1  bg-tertiary-300 py-3 rounded-full flex-row justify-center items-center"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text className="text-white text-base font-semibold ml-2">Start Ride</Text>
            </TouchableOpacity>

            {/* Chat Button */}
            <TouchableOpacity
              onPress={() => navigate.push('/ride/ride-cancel-reason')}
              className="flex-1 bg-red-500 rounded-full flex-row justify-center items-center"
            >
              <Ionicons name="close-circle-outline" size={20} color="white" />
              <Text className="text-white text-base font-semibold ml-2">Cancel Ride</Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default RideDetailsBottomSheet;
