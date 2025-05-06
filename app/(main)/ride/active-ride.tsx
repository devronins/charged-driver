import GoogleMap from '@/components/ui/map';
import Icons from '@/constants/icons';
import { useTypedSelector } from '@/store';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ActiveRide = () => {
  const { rideRequests } = useTypedSelector((state) => state.Ride);
  console.log('7>>>>>>>>>>', rideRequests);

  return (
    <View className="flex-1">
      <GoogleMap
        markers={[
          {
            latitude: 37.7749,
            longitude: -122.4194,
            icon: <Icons.CarFront size={17} color="#fff" />,
          },
        ]}
      />
    </View>
  );
};

export default ActiveRide;
