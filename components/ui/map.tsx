import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, MapViewProps, Polyline } from 'react-native-maps';
import { twMerge } from 'tailwind-merge';
import Loader from './Loader';

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
  polyLineCoords?: { latitude: number; longitude: number }[];
  liveCoords?: { latitude: number; longitude: number };
}

const defaultRegion = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const GoogleMap = ({
  style,
  mapViewProps,
  markers = [],
  polyLineCoords = [],
  liveCoords,
}: GoogleMapProps) => {
  const mapRef = useRef<MapView>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const mapFullyReady = isMapReady && isLayoutReady;

  // Trigger fitToCoordinates only after map and layout are ready
  useEffect(() => {
    if (mapFullyReady && markers.length >= 2 && mapRef.current) {
      mapRef.current.fitToCoordinates(
        markers.map((m) => ({ latitude: m.latitude, longitude: m.longitude })),
        {
          edgePadding: { top: 60, right: 60, bottom: 60, left: 60 },
          animated: true,
        }
      );
    }
  }, [mapFullyReady, markers]);

  // Memoize markers to avoid re-rendering
  const renderedMarkers = useMemo(
    () =>
      markers.map((marker, index) => (
        <Marker
          key={`${marker.latitude}-${marker.longitude}-${index}`}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
        >
          <View
            className={twMerge(
              'w-[36px] h-[36px] rounded-full flex items-center justify-center',
              marker.style
            )}
          >
            {marker.icon}
          </View>
        </Marker>
      )),
    [markers]
  );

  return (
    <>
      <MapView
        ref={mapRef}
        style={[{ width: '100%', height: '100%' }, style]}
        provider={PROVIDER_DEFAULT}
        initialRegion={defaultRegion}
        onMapReady={() => setIsMapReady(true)}
        onLayout={() => setIsLayoutReady(true)}
        {...mapViewProps}
      >
        {renderedMarkers}

        {polyLineCoords?.length > 0 && (
          <Polyline
            coordinates={polyLineCoords}
            strokeColor="#4285F4" // Google Blue
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* Show loader until map is fully ready */}
      <Loader open={!mapFullyReady} />
    </>
  );
};

export default GoogleMap;
