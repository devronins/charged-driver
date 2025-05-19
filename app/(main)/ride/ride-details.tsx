import CustomButton from '@/components/ui/CustomButton';
import InputField from '@/components/ui/InputField';
import InputFieldTextArea from '@/components/ui/InputFieldTextArea';
import { Model } from '@/components/ui/model';
import Icons from '@/constants/icons';
import images from '@/constants/images';
import { RideActions } from '@/reducers';
import { addRideRating } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { RideModal, RideStatus } from '@/utils/modals/ride';
import { CalendarDays, Car, CheckCircle2, Clock4, Flag, MapPin, X } from 'lucide-react-native';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native';
import { LottieView } from '@/utils/lottie';
import { LoaderJson } from '@/constants/animation';

const RideDetails = () => {
  const {
    rideDetails: ride,
    isRattingModelVisible,
    addRideRatingLoading,
  } = useTypedSelector((state) => state.Ride);
  const [rating, setRating] = useState(1);
  const [ratingDescription, setRatingDescription] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // in case driver click on back button, then in that case we change review model state
    return () => {
      if (isRattingModelVisible) {
        dispatch(RideActions.setReviewModelData({ isRattingModelVisible: null }));
      }
    };
  }, []);

  const handleAddRatingSubmit = () => {
    if (ride) {
      dispatch(
        addRideRating({
          rideId: ride.id,
          ratingData: {
            rating: rating,
            review: ratingDescription 
          },
        })
      );
    }
  };

  if (!ride) {
    return <Text>No Ride Details Found</Text>;
  }
  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className="min-h-screen w-full flex flex-col items-start justify-start p-6 gap-5">
        {/* Status and Timestamp Card */}
        <View className="w-full bg-white rounded-xl p-5">
          <Text
            className={`text-xs font-bold px-3 py-1 rounded-full self-start mb-4 ${
              ride.status === RideStatus.Completed
                ? 'bg-green-600 text-white'
                : ride.status === RideStatus.Cancelled
                  ? 'bg-red-600 text-white'
                  : 'bg-yellow-600 text-white'
            }`}
          >
            {ride.status.toUpperCase()}
          </Text>

          <View className="flex-row items-center">
            <CalendarDays size={18} color="#007FFF" />
            <Text className="ml-3 text-gray-800 text-sm font-medium">
              {moment(ride.completed_at || ride.cancelled_at || ride.created_at).format(
                'D MMM YYYY, h:mm A'
              )}
            </Text>
          </View>
        </View>

        {/* Pickup and Dropoff Card */}
        <View className="w-full bg-white rounded-xl p-5 gap-4">
          <Text className="text-lg font-semibold text-gray-800">Pickup & Dropoff</Text>
          <View className="w-full flex-row items-start justify-start gap-3">
            <MapPin size={20} color="#34C759" />
            <Text className="text-gray-900 text-base" style={{ flexShrink: 1 }}>
              {ride.pickup_address}
            </Text>
          </View>
          <View className="w-full flex-row items-start justify-start gap-3">
            <MapPin size={20} color="#EF4444" />
            <Text className="text-gray-900 text-base" style={{ flexShrink: 1 }}>
              {ride.dropoff_address}
            </Text>
          </View>
        </View>

        <View className="w-full bg-white rounded-xl p-5">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Duration & Distance</Text>

          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center">
              <Clock4 size={18} color="#007FFF" />
              <Text className="ml-3 text-gray-800">{ride.duration_minutes} mins</Text>
            </View>
            <Text className="text-gray-800">{ride.distance_km} km</Text>
          </View>

          {/* {ride.requested_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <Inbox size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Requested: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.requested_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )} */}

          {ride.accepted_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <CheckCircle2 size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Accepted: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.accepted_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )}

          {ride.arrived_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <MapPin size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Arrived: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.arrived_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )}

          {ride.started_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <Car size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Started: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.started_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )}

          {ride.completed_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <Flag size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Completed: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.completed_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )}

          {ride.cancelled_at && (
            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <X size={18} color="#007FFF" />
                <Text className="ml-3 text-gray-800">Canceled: </Text>
              </View>
              <Text className="text-gray-800">
                {moment(ride.cancelled_at).format('D MMM YYYY, h:mm A')}
              </Text>
            </View>
          )}
        </View>

        {/* Fare Summary Card */}
        {ride.status === RideStatus.Cancelled ? (
          <View className="w-full bg-white rounded-xl p-5">
            <Text className="font-semibold text-xl mb-4 text-gray-800">Fare Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-medium">Cancelation Fare</Text>
              <Text className="text-gray-900 font-medium">CAD {ride.cancellation_fee}</Text>
            </View>
          </View>
        ) : (
          <View className="w-full bg-white rounded-xl p-5">
            <Text className="font-semibold text-xl mb-4 text-gray-800">Fare Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-medium">Base Fare</Text>
              <Text className="text-gray-900 font-medium">CAD {ride.base_fare}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-medium">Distance Fare</Text>
              <Text className="text-gray-900 font-medium">CAD {ride.distance_fare}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-medium">Time Fare</Text>
              <Text className="text-gray-900 font-medium">CAD {ride.time_fare}</Text>
            </View>
            {/* <View className="flex-row justify-between mb-2">
          <Text className="text-gray-700 font-medium">Surge</Text>
          <Text className="text-gray-900 font-medium">x{ride.surge_multiplier}</Text>
        </View> */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700 font-medium">Govt Tax</Text>
              <Text className="text-gray-900 font-medium">CAD {ride.govt_tax_percentage}</Text>
            </View>
            <View className="flex-row justify-between mt-3 border-t border-gray-300 pt-2">
              <Text className="font-semibold text-gray-900 text-lg">Total Fare</Text>
              <Text className="font-semibold text-lg text-gray-900">CAD {ride.total_fare}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="font-semibold text-gray-900 text-lg">Platform Fee</Text>
              <Text className="font-semibold text-lg text-gray-900">CAD -{ride.platform_fee}</Text>
            </View>

            <View className="flex-row justify-between mt-3 border-t border-gray-300 pt-2">
              <Text className="font-semibold text-tertiary-300 text-lg">Your Earnings</Text>
              <Text className="font-semibold text-lg text-tertiary-300 ">
                CAD {ride.driver_earnings}
              </Text>
            </View>
          </View>
        )}

        {/* Payment Method Card */}
        <View className="w-full bg-white rounded-xl p-5">
          <Text className="text-gray-700 text-xl font-medium mb-4">Payment Method</Text>
          <Text className="font-medium text-gray-800">{ride.payment_status}</Text>
        </View>

        {/* Cancellation Card */}
        {/* {ride.status === RideStatus.Cancelled && ride.cancellation_reason && (
          <View className="w-full bg-white rounded-xl p-5">
            <Text className="text-red-600 font-semibold text-lg mb-3">Cancellation Reason</Text>
            <Text className="text-gray-800">{ride.cancellation_reason}</Text>
          </View>
        )} */}
      </View>

      <Model
        animationType="slide"
        open={
          isRattingModelVisible && isRattingModelVisible.ride_id === ride.id
            ? isRattingModelVisible.isVisible
            : false
        }
        className="flex-1 flex items-center justify-center bg-black/30 p-6"
        setValue={() => {}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}
        >
          <View className="relative w-full bg-white p-6 rounded-lg flex flex-col gap-5">
            <View className="w-full flex flex-col justify-center items-center gap-2">
              <View className="flex items-center justify-center">
                <Text className="text-2xl">Share your experience</Text>
              </View>
              <View className="flex items-center justify-center">
                <Image
                  source={images.AvatarImage}
                  className="h-[70px] w-[70px] rounded-full border-border-300 "
                  resizeMode="cover"
                />
              </View>
            </View>
            <View className="w-full flex flex-col justify-center items-center gap-3">
              <View className="flex flex-row items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Icons.Star
                      size={32}
                      color="#FFD700" // gold color
                      fill={i <= rating ? '#FFD700' : 'transparent'} // filled if rating selected
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View className="w-full flex items-center justify-center">
                <InputFieldTextArea
                  editable={!addRideRatingLoading}
                  inputStyle="h-28"
                  placeholder="Let us know your experience"
                  value={ratingDescription}
                  onChangeText={(value) => setRatingDescription(value)}
                  multiline
                  numberOfLines={5}
                />
              </View>
              <CustomButton
                IconLeft={
                  addRideRatingLoading ? (
                    <LottieView
                      source={LoaderJson}
                      style={{ width: 25, height: 25 }}
                      loop
                      autoPlay
                    />
                  ) : null
                }
                title={addRideRatingLoading ? '' : 'Submit Review'}
                className={`${Platform.OS === 'ios' ? 'py-2' : 'py-3'}`}
                onPress={() => handleAddRatingSubmit()}
                disabled={addRideRatingLoading}
              />
            </View>
            <TouchableOpacity
              className="absolute top-1 right-1"
              onPress={() =>
                dispatch(RideActions.setReviewModelData({ isRattingModelVisible: null }))
              }
            >
              <Icons.Close size={23} color={'black'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Model>
    </ScrollView>
  );
};
export default RideDetails;
