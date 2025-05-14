import { Alert, Animated, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useTypedSelector } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { editDriver, openAppSettings, requestLocationPermission } from '@/services';
import {
  startLocationUpdatesBackgroundTask,
  stopLocationUpdatesBackgroundTask,
} from '@/services/task-manager';
import { DriverActions } from '@/reducers';

const coordinatesObj = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const OnlineOffline = () => {
  const { location } = useTypedSelector((state) => state.Permission);
  const { driverDetails, accessToken, driverDetailsLoading } = useTypedSelector(
    (state) => state.Driver
  );
  const dispatch = useAppDispatch();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isOnline, setIsOnline] = useState(driverDetails?.is_online || false);

  const animateScale = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.15,
      useNativeDriver: true,
      speed: 12, // controls animation speed
      bounciness: 10, // controls bounce feel
    }).start(() => {
      setTimeout(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 12,
          bounciness: 10,
        }).start();
      }, 800);
    });
  };
  const toggleSwitch = async () => {
    try {
      const driverUpdatedPayload = {
        ...driverDetails,
        is_online: driverDetails?.is_online ? false : true,
      };

      dispatch(DriverActions.setDriverDetailsLoading({ driverDetailsLoading: true }));
      setIsOnline(driverUpdatedPayload.is_online);
      animateScale();

      if (driverUpdatedPayload?.is_online) {
        await requestLocationPermission();
        await startLocationUpdatesBackgroundTask();
      } else {
        await stopLocationUpdatesBackgroundTask();
      }

      dispatch(
        editDriver({
          driverDetails: { ...driverDetails, is_online: driverDetails?.is_online ? false : true },
        })
      );
    } catch (error: any) {
      dispatch(DriverActions.setDriverDetailsLoading({ driverDetailsLoading: false }));
      setIsOnline(false);
      Alert.alert(error.data.type, error.data.message, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          style: 'destructive',
          onPress: () => {
            openAppSettings();
          },
        },
      ]);
    }
  };

  return (
    <View className="absolute bottom-8 z-10 self-center">
      <Animated.View
        className={twMerge(
          'flex-row items-center py-2.5 px-4 rounded-full border border-black/10 shadow-md bg-white gap-4',
          driverDetailsLoading && 'bg-gray-200'
        )}
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex items-center justify-center">
          <Text
            className={twMerge(
              'text-lg font-semibold',
              isOnline ? 'text-tertiary-300' : 'text-red-400'
            )}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <View className="flex items-center justify-center">
          <Switch
            trackColor={{ false: '#fecaca', true: '#bbf7d0' }}
            thumbColor={isOnline ? '#34C759' : '#ef4444'}
            ios_backgroundColor="#fecaca"
            onValueChange={toggleSwitch}
            value={isOnline}
            disabled={driverDetailsLoading}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default OnlineOffline;
