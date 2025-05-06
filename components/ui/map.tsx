import { View, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, MapViewProps } from 'react-native-maps';
import { twMerge } from 'tailwind-merge';

interface MarkerType {
  latitude: number;
  longitude: number;
  icon?: JSX.Element; // dynamic icon
  style?: string; // custom style for marker container
}

interface GoogleMapProps {
  style?: StyleProp<ViewStyle>;
  mapViewProps?: Partial<MapViewProps>;
  markers?: MarkerType[];
}

const defaultRegion = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const GoogleMap = ({ style, mapViewProps, markers = [] }: GoogleMapProps) => {
  return (
    <MapView
      style={[{ width: '100%', height: '100%' }, style]}
      provider={PROVIDER_DEFAULT}
      initialRegion={defaultRegion}
      showsUserLocation
      onMapReady={() => console.log('loaded map')}
      {...mapViewProps}
    >
      {markers.map((marker, index) => (
        <Marker key={index} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
          <View
            className={twMerge(
              'w-[36px] h-[36px] rounded-full flex items-center justify-center border-[2px] border-white bg-primary-300',
              marker.style
            )}
          >
            {marker.icon}
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

export default GoogleMap;
