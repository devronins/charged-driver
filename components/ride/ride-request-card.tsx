import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useAppDispatch } from '@/store';
import { RideActions } from '@/reducers';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
import { MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { cancelRideRequest, changeRideStatus } from '@/services';
import { RideStatus } from '@/utils/modals/ride';

const SCREEN_WIDTH = Dimensions.get('window').width;

const RideCard = ({ item, index }: { item: firebaseDriverRidesModal; index: number }) => {
  const navigate = useRouter();
  const dispatch = useAppDispatch();
  const translateX = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(-100)).current;

  // Slide in animation (staggered)
  useEffect(() => {
    Animated.timing(slideY, {
      toValue: 0,
      duration: 300,
      delay: index * 100, // stagger by index
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGesture = Animated.event([{ nativeEvent: { translationX: translateX } }], {
    useNativeDriver: true,
  });

  const handleEnd = ({ nativeEvent }: any) => {
    if (Math.abs(nativeEvent.translationX) > SCREEN_WIDTH * 0.4) {
      Animated.timing(translateX, {
        toValue: nativeEvent.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() =>
        dispatch(cancelRideRequest({ driverRide: { ...item, status: RideStatus.Cancelled } }))
      );
    } else {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleEnd}>
      <Animated.View
        style={{
          transform: [{ translateX }, { translateY: slideY }],
        }}
        className="w-full rounded-2xl bg-white p-4 mb-3 shadow-sm"
      >
        <View className="mb-2">
          <Text className="text-text-300 font-semibold text-base">Ride ID: {item.ride_id}</Text>
        </View>

        <View className="flex-row items-start gap-2 mb-1">
          <MapPin size={16} color="#007FFF" />
          <Text className="text-text-200 flex-1 text-sm">{item.pickup_address}</Text>
        </View>

        <View className="flex-row items-start gap-2 mb-1">
          <MapPin size={16} color="#34C759" />
          <Text className="text-text-200 flex-1 text-sm">{item.dropoff_address}</Text>
        </View>

        <View className="flex-row justify-between items-center mt-2 mb-3">
          <Text className="text-text-100 text-sm">Fare: ${item.fare?.toFixed(2)}</Text>
          <Text className="text-text-100 text-sm">By: {item.requested_by}</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() =>
              dispatch(cancelRideRequest({ driverRide: { ...item, status: RideStatus.Cancelled } }))
            }
            className="flex-1 bg-border-100 py-2 rounded-full items-center"
          >
            <Text className="text-text-200 font-medium">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              dispatch(
                changeRideStatus({
                  ride: { ride_id: item.ride_id, status: RideStatus.Accepted },
                  navigate: () => navigate.push('/ride/active-ride'),
                })
              )
            }
            className="flex-1 bg-tertiary-300 py-2 rounded-full items-center"
          >
            <Text className="text-white font-medium">Accept</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default RideCard;
