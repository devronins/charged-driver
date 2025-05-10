import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icons from '@/constants/icons';
import { useAppDispatch, useTypedSelector } from '@/store';
import { useRouter } from 'expo-router';
import { RideStatus } from '@/utils/modals/ride';
import { changeRideStatus } from '@/services';
import Loader from '@/components/ui/Loader';

const cancelReasonConstants = [
  {
    id: 1,
    labelIcon: Icons.HelpCircle,
    title: "Can't find the rider",
  },
  {
    id: 2,
    labelIcon: Icons.MoveRight,
    title: 'Nowhere to stop',
  },
  {
    id: 3,
    labelIcon: Icons.Briefcase,
    title: 'Rider’s items don’t fit',
  },
  {
    id: 4,
    labelIcon: Icons.Users,
    title: 'Too many riders',
  },
  {
    id: 5,
    labelIcon: Icons.UserX,
    title: 'Unaccompanied minor',
  },
  {
    id: 6,
    labelIcon: Icons.Baby,
    title: 'No car seat',
  },
  {
    id: 7,
    labelIcon: Icons.PawPrint,
    title: 'Rider has an animal',
  },
  {
    id: 8,
    labelIcon: Icons.AlertCircle,
    title: 'Rider behavior',
  },
  {
    id: 9,
    labelIcon: Icons.AlertTriangle,
    title: 'Not safe to pick up',
  },
];

const moreCancelReasonConstants = [
  {
    id: 1,
    title: "Don't want to wait",
  },
  {
    id: 2,
    title: 'Personal issue',
  },
  {
    id: 3,
    title: 'Need to rest',
  },
  {
    id: 4,
    title: 'None of these',
  },
];

const RideCancel = () => {
  const { activeRide, loading } = useTypedSelector((state) => state.Ride);
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const handleChangeRideStatus = (status: RideStatus, cancelReason: string) => {
    dispatch(
      changeRideStatus({
        ride: { ride_id: activeRide?.id || 0, status: status, cancellation_reason: cancelReason },
        navigate: () => navigate.push('/home'),
      })
    );
  };

  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className="flex-1 flex flex-col items-center p-6 gap-5">
        <View className="w-full h-auto bg-white rounded-lg flex flex-col items-center">
          <View className="w-full flex items-start justify-center p-5 pb-0">
            <Text className="text-2xl font-semibold text-primary-300">
              Something wrong? Choose an issue:
            </Text>
          </View>
          {cancelReasonConstants.map((item, index) => (
            <TouchableOpacity
              key={item.id.toString()}
              className={`w-full flex flex-row items-center justify-between gap-1 p-5 ${index > 0 && 'border-t-[2px] border-secondary-300'}`}
              onPress={() => handleChangeRideStatus(RideStatus.Cancelled, item.title)}
            >
              <View className="flex flex-row items-cente justify-center gap-4">
                <View className="flex items-center justify-center">
                  <item.labelIcon color={'#007FFF'} size={25} />
                </View>
                <View className="flex items-center justify-center">
                  <Text className="text-[16px] text-text-300">{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="w-full h-auto bg-white rounded-lg flex flex-col items-center">
          <View className="w-full flex items-start justify-center p-5 pb-0">
            <Text className="text-2xl font-semibold text-primary-300">More issues</Text>
          </View>
          {moreCancelReasonConstants.map((item, index) => (
            <TouchableOpacity
              key={item.id.toString()}
              className={`w-full flex flex-row items-center justify-between gap-1 p-5 ${index > 0 && 'border-t-[2px] border-secondary-300'}`}
              onPress={() => handleChangeRideStatus(RideStatus.Cancelled, item.title)}
            >
              <View className="flex flex-row items-cente justify-center gap-4">
                <View className="flex items-center justify-center">
                  <Text className="text-[16px] text-text-300">{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Loader open={loading} />
    </ScrollView>
  );
};

export default RideCancel;
