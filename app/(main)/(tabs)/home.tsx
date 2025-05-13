import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Icons from '@/constants/icons';
import { useAppDispatch, useTypedSelector } from '@/store';
import OnlineOffline from '@/components/home/online-offline-section';
import Loader from '@/components/ui/Loader';
import GoogleMap from '@/components/ui/map';
import RideInProgressCard from '@/components/ride/active-ride-notification-card';
import { useEffect } from 'react';
import { getDriver, getRides, getVehicleDetails } from '@/services';

const coordinatesObj = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Home = () => {
  const { driverDetailsLoading, accessToken, driverDetails } = useTypedSelector(
    (state) => state.Driver
  );
  const { vehicleDetails } = useTypedSelector((state) => state.Vehicle);
  const { activeRide } = useTypedSelector((state) => state.Ride);
  const dispatch = useAppDispatch();
  // console.log('19>>>>>>', accessToken, driverDetails?.id, vehicleDetails);

  useEffect(() => {
    dispatch(getVehicleDetails({}));
    dispatch(getDriver({}));
    dispatch(getRides({}));
  }, []);

  return (
    <View className="flex-1">
      <GoogleMap markers={[]} />

      {/*Center map on current location */}
      {/* <TouchableOpacity className="w-12 h-12 flex items-center justify-center bg-primary-300 rounded-full absolute bottom-8 right-5">
        <Icons.Locate size={20} color={'#FFFFFF'} />
      </TouchableOpacity> */}

      {vehicleDetails && driverDetails?.is_active && !activeRide && <OnlineOffline />}

      {/* <Loader open={driverDetailsLoading} className="bg-black/80" /> */}

      <RideInProgressCard />
    </View>
  );
};

export default Home;
