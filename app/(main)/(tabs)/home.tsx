import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icons from '@/constants/icons';
import { useTypedSelector } from '@/store';

const coordinatesObj = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Home = () => {
  const { location } = useTypedSelector((state) => state.Permission);

  return (
    <View className="flex-1">
      <MapView
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full"
        initialRegion={coordinatesObj}
        region={coordinatesObj}
        showsUserLocation
        followsUserLocation
      >
        <Marker
          coordinate={{
            latitude: coordinatesObj.latitude,
            longitude: coordinatesObj.longitude,
          }}
        >
          <View className="w-[36px] h-[36px] rounded-full flex items-center justify-center border-[2px] border-white bg-primary-300">
            <Icons.CarFront size={17} color={'#FFFFFF'} />
          </View>
        </Marker>
        {/* TODO: we can pass multiple marker to this */}
      </MapView>

      {/*Center map on current location */}
      <TouchableOpacity className="w-12 h-12 flex items-center justify-center bg-primary-300 rounded-full absolute bottom-8 right-5">
        <Icons.Locate size={20} color={'#FFFFFF'} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;
