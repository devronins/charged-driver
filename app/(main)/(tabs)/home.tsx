import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import Icons from '@/constants/icons';
import { useTypedSelector } from '@/store';
import OnlineOffline from '@/components/home/online-offline-section';
import Loader from '@/components/ui/Loader';
import GoogleMap from '@/components/ui/map';
import RideInProgressCard from '@/components/ride/active-ride-notification-card';

const coordinatesObj = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Home = () => {
  const { driverDetailsLoading } = useTypedSelector((state) => state.Driver);
  const { vehicleDetails } = useTypedSelector((state) => state.Vehicle);

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

      {/*Center map on current location */}
      <TouchableOpacity className="w-12 h-12 flex items-center justify-center bg-primary-300 rounded-full absolute bottom-8 right-5">
        <Icons.Locate size={20} color={'#FFFFFF'} />
      </TouchableOpacity>

      {vehicleDetails && <OnlineOffline />}

      <Loader open={driverDetailsLoading} className="bg-black/80" />

      <RideInProgressCard />
    </View>
  );
};

export default Home;
