import { useAppDispatch, useTypedSelector } from '@/store';
import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Model } from '../ui/model';
import { useEffect, useState } from 'react';
import RideCard from './ride-request-card';

const RideRequests = () => {
  const { rideRequests } = useTypedSelector((state) => state.Ride);
  const [isModelVisible, setIsModelVisible] = useState(false);

  useEffect(() => {
    rideRequests.length === 0 ? setIsModelVisible(false) : setIsModelVisible(true);
  }, [rideRequests.length]);

  return (
    <Model
      animationType="fade"
      open={isModelVisible}
      setValue={() => {}}
      className={`flex-1 flex justify-start mt-10`}
    >
      <FlatList
        data={rideRequests}
        keyExtractor={(item, index) => (index + 1).toString()}
        renderItem={({ item, index }) => <RideCard item={item} index={index} />}
        className="p-5"
        showsVerticalScrollIndicator={false}
      />
    </Model>
  );
};

export default RideRequests;
