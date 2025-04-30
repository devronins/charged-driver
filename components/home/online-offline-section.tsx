import { Animated, Switch, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Icons from '@/constants/icons';
import { useAppDispatch, useTypedSelector } from '@/store';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { editDriver } from '@/services';

const coordinatesObj = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const OnlineOffline = () => {
  const { location } = useTypedSelector((state) => state.Permission);
  const { driverDetails, accessToken } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isEnabled, setIsEnabled] = useState(false);

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
  const toggleSwitch = () => {
    animateScale();
    dispatch(
      editDriver({
        driverDetails: { ...driverDetails, is_online: driverDetails?.is_online ? false : true },
      })
    );
  };

  return (
    <View className="absolute bottom-8 z-10 self-center">
      <Animated.View
        className="flex-row items-center py-2.5 px-4 rounded-full border border-black/10 shadow-md bg-white gap-4"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="flex items-center justify-center">
          <Text
            className={twMerge(
              'text-lg font-semibold',
              driverDetails?.is_online ? 'text-tertiary-300' : 'text-red-400'
            )}
          >
            {driverDetails?.is_online ? 'Online' : 'Offline'}
          </Text>
        </View>
        <View className="flex items-center justify-center">
          <Switch
            trackColor={{ false: '#fecaca', true: '#bbf7d0' }}
            thumbColor={driverDetails?.is_online ? '#34C759' : '#ef4444'}
            ios_backgroundColor="#fecaca"
            onValueChange={toggleSwitch}
            value={driverDetails?.is_online}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default OnlineOffline;
