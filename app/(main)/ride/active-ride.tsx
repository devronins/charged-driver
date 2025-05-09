import RideDetailsBottomSheet from '@/components/ride/active-ride-bottom-sheet';
import Loader from '@/components/ui/Loader';
import GoogleMap from '@/components/ui/map';
import Icons from '@/constants/icons';
import {
  changeRideStatus,
  getRideMapDirectionCoordinates,
  startDriverLocationTracking,
  stopDriverLocationTracking,
} from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { RideStatus } from '@/utils/modals/ride';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { DropoffJson, PickupJson } from '@/constants/animation';
import { useRouter } from 'expo-router';

const ActiveRide = () => {
  const { activeRide, loading, activeRideMapDirectionCoordinates } = useTypedSelector(
    (state) => state.Ride
  );
  const { driverDetails } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const handleChangeRideStatus = (status: RideStatus) => {
    dispatch(
      changeRideStatus({
        ride: { ride_id: activeRide?.id || 0, status: status },
        navigate: () => navigate.push('/home'),
      })
    );
  };

  useEffect(() => {
    if (activeRide?.status === RideStatus.Started || activeRide?.status === RideStatus.Accepted) {
      dispatch(
        getRideMapDirectionCoordinates({
          coordinates: {
            origin: {
              lat: Number(driverDetails?.last_location_lat),
              lng: Number(driverDetails?.last_location_lng),
            },
            destination: {
              lat: Number(activeRide.dropoff_lat),
              lng: Number(activeRide.dropoff_lng),
            },
            waypoints: [
              {
                lat: Number(activeRide.pickup_lat),
                lng: Number(activeRide.pickup_lng),
              },
            ]
              .map((wp) => `${wp.lat},${wp.lng}`)
              .join('|'),
          },
        })
      );

      startDriverLocationTracking(dispatch, activeRide);
    }

    return () => {
      stopDriverLocationTracking();
    };
  }, [activeRide]);

  return (
    <View className="flex-1 h-full w-full pb-5 bg-white">
      <GoogleMap
        markers={[
          {
            latitude: Number(activeRide?.pickup_lat) || 0,
            longitude: Number(activeRide?.pickup_lng) || 0,
            icon: (
              <LottieView
                source={PickupJson}
                style={{ width: 70, height: 70 }}
                autoPlay
                loop={true}
              />
            ),
          },
          {
            latitude: Number(activeRide?.dropoff_lat) || 0,
            longitude: Number(activeRide?.dropoff_lng) || 0,
            icon: (
              <LottieView
                source={DropoffJson}
                style={{ width: 70, height: 70 }}
                autoPlay
                loop={true}
              />
            ),
          },
          {
            latitude: Number(driverDetails?.last_location_lat) || 0,
            longitude: Number(driverDetails?.last_location_lng) || 0,
            icon: <Icons.CarFront size={30} color="#fff" />,
          },
        ]}
        polyLineCoords={activeRideMapDirectionCoordinates}
      />
      {activeRide && (
        <>
          <RideDetailsBottomSheet
            ride={activeRide}
            onChat={() => {}}
            onChnageRideStatus={handleChangeRideStatus}
            isVisible={true}
          />
          <Loader open={loading} />
        </>
      )}
    </View>
  );
};

export default ActiveRide;
