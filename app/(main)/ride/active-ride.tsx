import RideDetailsBottomSheet from '@/components/ui/bottomSheet';
import GoogleMap from '@/components/ui/map';
import Icons from '@/constants/icons';
import { useTypedSelector } from '@/store';
import { Text, View } from 'react-native';

const ActiveRide = () => {
  const { activeRide } = useTypedSelector((state) => state.Ride);

  return (
    <View className="flex-1 h-full w-full pb-5 bg-white">
      <GoogleMap
        markers={[
          {
            latitude: 37.7749,
            longitude: -122.4194,
            icon: <Icons.CarFront size={17} color="#fff" />,
          },
        ]}
      />
      {activeRide && (
        <RideDetailsBottomSheet
          ride={activeRide}
          onChat={() => {}}
          onStartRide={() => {}}
          isVisible={true}
        />
      )}
    </View>
  );
};

export default ActiveRide;
