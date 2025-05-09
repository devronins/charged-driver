import RideDetailsBottomSheet from '@/components/ride/active-ride-bottom-sheet';
import Loader from '@/components/ui/Loader';
import GoogleMap from '@/components/ui/map';
import Icons from '@/constants/icons';
import { changeRideStatus } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { RideStatus } from '@/utils/modals/ride';
import { Text, View } from 'react-native';

const ActiveRide = () => {
  const { activeRide, loading } = useTypedSelector((state) => state.Ride);
  const dispatch = useAppDispatch();

  const handleChangeRideStatus = (status: RideStatus) => {
    dispatch(changeRideStatus({ ride: { ride_id: activeRide?.id || 0, status: status } }));
  };

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
       <>
        <RideDetailsBottomSheet
          ride={activeRide}
          onChat={() => {}}
          onChnageRideStatus={handleChangeRideStatus}
          isVisible={true}
        />
        <Loader open={loading}/>
       </>
      )}
    </View>
  );
};

export default ActiveRide;
