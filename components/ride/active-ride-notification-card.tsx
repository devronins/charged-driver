import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { useAppDispatch, useTypedSelector } from '@/store';
import { MapPin } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { Model } from '../ui/model';

const RideInProgressCard = () => {
  const { activeRide } = useTypedSelector((state) => state.Ride);
  const navigate = useRouter();
  const pathname = usePathname();
  const slideY = useRef(new Animated.Value(-100)).current;

  // Slide-in animation
  useEffect(() => {
    Animated.timing(slideY, {
      toValue: 0,
      duration: 300,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!activeRide || pathname === '/ride/active-ride') {
    return null;
  }

  return (
    <View className={`absolute w-full flex justify-start mt-10 p-5`}>
      <Animated.View
        style={{ transform: [{ translateY: slideY }] }}
        className="w-full rounded-2xl bg-white p-3 mb-3 shadow-sm"
      >
        <Text className="text-text-300 font-semibold text-lg mb-2"> Ride In Progress</Text>

        <View className="flex-row items-start gap-2 mb-1">
          <MapPin size={16} color="#007FFF" />
          <Text className="text-text-200 flex-1 text-sm">{activeRide?.pickup_address}</Text>
        </View>

        <View className="flex-row items-start gap-2 mb-2">
          <MapPin size={16} color="#34C759" />
          <Text className="text-text-200 flex-1 text-sm">{activeRide?.dropoff_address}</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigate.push('/ride/active-ride')}
          className="bg-primary-300 py-2 rounded-full items-center"
        >
          <Text className="text-white font-medium text-sm">See Ride Details</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default RideInProgressCard;
