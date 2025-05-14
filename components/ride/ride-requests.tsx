import { useAppDispatch, useTypedSelector } from '@/store';
import {
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Model } from '../ui/model';
import { useEffect, useState } from 'react';
import RideCard from './ride-request-card';
import Loader from '../ui/Loader';

const RideRequests = () => {
  const { rideRequests, loading } = useTypedSelector((state) => state.Ride);

  if (rideRequests.length === 0) {
    return null;
  }

  return (
    <>
      <View className={`absolute inset-0 z-[0] ${Platform.OS === 'ios' && 'mt-10'}`}>
        <FlatList
          data={rideRequests}
          keyExtractor={(item, index) => (index + 1).toString()}
          renderItem={({ item, index }) => <RideCard item={item} index={index} />}
          className="p-5"
          showsVerticalScrollIndicator={false}
        />
      </View>
      {/* <Loader open={loading} /> */}
    </>
  );
};

export default RideRequests;
