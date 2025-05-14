import RideDetailsBottomSheet from '@/components/ride/active-ride-bottom-sheet';
import Loader from '@/components/ui/Loader';
import GoogleMap from '@/components/ui/map';
import Icons from '@/constants/icons';
import {
  calculateDistance,
  changeRideStatus,
  getRideMapDirectionCoordinates,
  startDriverLocationTracking,
  stopDriverLocationTracking,
} from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { RideStatus } from '@/utils/modals/ride';
import { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import images from '@/constants/images';
import { Redirect, useRouter } from 'expo-router';
import { Toast } from '@/utils/toast';

const ActiveRide = () => {
  const { activeRide, loading, activeRideMapDirectionCoordinates } = useTypedSelector(
    (state) => state.Ride
  );
  const { driverDetails } = useTypedSelector((state) => state.Driver);
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const handleChangeRideStatus = (status: RideStatus) => {
    if (status === RideStatus.Started) {
      const { distanceInMeters } = calculateDistance({
        to: {
          latitude: Number(activeRide?.pickup_lat) || 0,
          longitude: Number(activeRide?.pickup_lng) || 0,
        },
        from: {
          latitude: driverDetails?.last_location_lat || 0,
          longitude: driverDetails?.last_location_lng || 0,
        },
      });

      if (distanceInMeters > 50) {
        Toast.show({
          type: 'info',
          text1: 'Too far from pickup location',
          text2: `You must be within 50 meters to start the ride`,
        });
        return;
      }
    }

    dispatch(
      changeRideStatus({
        ride: { ride_id: activeRide?.id || 0, status: status },
        navigate:
          status === RideStatus.Completed ? () => navigate.push('/ride/ride-details') : undefined,
      })
    );
  };

  useEffect(() => {
    if (activeRide?.status === RideStatus.Started || activeRide?.status === RideStatus.Accepted) {
      dispatch(
        getRideMapDirectionCoordinates({
          activeRide: activeRide,
        })
      );
    }
  }, [activeRide?.status]);

  useEffect(() => {
    if (activeRide?.status === RideStatus.Started || activeRide?.status === RideStatus.Accepted) {
      stopDriverLocationTracking(); //Always clean privious task
      startDriverLocationTracking(dispatch, activeRide);
    }

    return () => {
      stopDriverLocationTracking();
    };
  }, [activeRide?.status]);

  if (!activeRide || activeRide.status === RideStatus.Cancelled)
    return <Redirect href="/(main)/(tabs)/home" />;

  return (
    <View className="flex-1 h-full w-full pb-5 bg-white">
      <GoogleMap
        markers={[
          {
            latitude: Number(activeRide?.pickup_lat) || 0,
            longitude: Number(activeRide?.pickup_lng) || 0,
            icon: (
              <Image
                source={images.LocationPickupImage}
                className="h-[30px] w-[30px]"
                resizeMode="contain"
              />
            ),
          },
          {
            latitude: Number(activeRide?.dropoff_lat) || 0,
            longitude: Number(activeRide?.dropoff_lng) || 0,
            icon: (
              <Image
                source={images.LocationDropOffImage}
                className="h-[30px] w-[30px]"
                resizeMode="contain"
              />
            ),
          },
          // {
          //   latitude: Number(driverDetails?.last_location_lat) || 0,
          //   longitude: Number(driverDetails?.last_location_lng) || 0,
          //   icon: (
          //     <View className="bg-primary-300 w-10 h-10 rounded-full flex items-center justify-center">
          //       <Icons.CarFront size={30} color="#fff" />
          //     </View>
          //   ),
          // },
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
