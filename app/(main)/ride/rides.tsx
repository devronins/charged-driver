import { getRides } from '@/services';
import { useAppDispatch, useTypedSelector } from '@/store';
import { CalendarDays, Clock4, MapPin } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { RideModal, RideStatus } from '@/utils/modals/ride';
import Loader from '@/components/ui/Loader';
import { twMerge } from 'tailwind-merge';
import { RideActions } from '@/reducers';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';

const statusOrder: Record<RideStatus, number> = {
  [RideStatus.Started]: 1,
  [RideStatus.Accepted]: 2,
  [RideStatus.Completed]: 3,
  [RideStatus.Cancelled]: 4,
  [RideStatus.Requested]: 5, // Include all possible statuses to avoid type error
};

const filterOptions = [
  {
    id: 1,
    title: 'All',
    value: '',
  },
  {
    id: 2,
    title: 'Completed',
    value: RideStatus.Completed,
  },
  {
    id: 3,
    title: 'Canceled',
    value: RideStatus.Cancelled,
  },
];

const Rides = () => {
  const { rides, loading } = useTypedSelector((state) => state.Ride);
  const dispatch = useAppDispatch();
  const navigate = useRouter();
  const [ridesCopy, setRidesCopy] = useState<RideModal[]>([]);
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    dispatch(getRides({}));
  }, []);

  useEffect(() => {
    if (rides?.length) {
      const sortedRides = rides
        ?.filter(
          (ride) => ride.status === RideStatus.Completed || ride.status === RideStatus.Cancelled
        )
        ?.sort(
          (a, b) =>
            moment(b.completed_at || b.cancelled_at).valueOf() -
            moment(a.completed_at || a.cancelled_at).valueOf()
        );
      setRidesCopy(sortedRides);
    }
  }, [rides]);

  const handleFilter = (data: { id: number; title: string; value: string }) => {
    if (data.value) {
      setFilterValue(data.value);
      const filteredRides = rides
        ?.filter((ride) => ride.status === data.value)
        ?.sort(
          (a, b) =>
            moment(b.completed_at || b.cancelled_at).valueOf() -
            moment(a.completed_at || a.cancelled_at).valueOf()
        );
      setRidesCopy(filteredRides);
    } else if (data.value === '') {
      setFilterValue(data.value);
      const filteredRides = rides
        ?.filter(
          (ride) => ride.status === RideStatus.Completed || ride.status === RideStatus.Cancelled
        )
        ?.sort(
          (a, b) =>
            moment(b.completed_at || b.cancelled_at).valueOf() -
            moment(a.completed_at || a.cancelled_at).valueOf()
        );
      setRidesCopy(filteredRides);
    }
  };

  const renderRideItem = ({ item: ride }: { item: RideModal }) => (
    <TouchableOpacity
      className="w-full bg-white p-4 rounded-2xl shadow-md mb-5"
      onPress={() =>
        dispatch(
          RideActions.setRideDetails({
            rideDetails: ride,
            navigate: () => navigate.push('/ride/ride-details'),
          })
        )
      }
    >
      <View className="w-full flex flex-row items-start gap-5">
        <View className="flex-1 flex-col items-start justify-center">
          <View className="flex-row items-center mb-2">
            <CalendarDays size={16} color="#007FFF" />
            <Text className="ml-2 text-sm font-semibold text-gray-800">
              {moment(ride.completed_at || ride.cancelled_at).format('D MMMM, h:mm A')}
            </Text>
          </View>

          <View className="flex-row items-center mb-4">
            <Clock4 size={16} color="#007FFF" />
            <Text className="ml-2 text-sm font-medium text-gray-600">{`${ride.duration_minutes} MINS`}</Text>
          </View>
        </View>

        <View className="flex flex-row items-start justify-start">
          <Text
            className={`text-sm text-white px-2 py-1 rounded-lg ${
              ride.status === RideStatus.Completed
                ? 'bg-tertiary-300'
                : ride.status === RideStatus.Started
                  ? 'bg-yellow-500'
                  : ride.status === RideStatus.Cancelled
                    ? 'bg-red-500'
                    : ride.status === RideStatus.Accepted
                      ? 'bg-orange-400'
                      : 'bg-gray-400'
            }`}
          >
            {ride.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="w-full flex flex-col items-start justify-center mt-2">
        <View className="flex-row items-start mb-1">
          <MapPin size={16} color="#34C759" />
          <Text className="ml-2 text-sm text-gray-800" style={{ flexShrink: 1 }}>
            {ride.pickup_address}
          </Text>
        </View>
        <View className="flex-row items-start">
          <MapPin size={16} color="#ef4444" />
          <Text className="ml-2 text-sm text-gray-800" style={{ flexShrink: 1 }}>
            {ride.dropoff_address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View className="min-h-screen w-full flex flex-col items-center justify-start p-6 gap-5">
        <View className="w-full flex flex-row items-center gap-5">
          {filterOptions?.map((item) => (
            <TouchableOpacity
              className={twMerge(
                'flex items-center justify-center py-2 px-4 rounded-full bg-white shadow-md',
                item.value === filterValue && 'bg-primary-300'
              )}
              onPress={() => handleFilter(item)}
            >
              <Text
                className={twMerge(
                  'text-lg min-w-14 text-center',
                  item.value === filterValue && 'text-white'
                )}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="w-full flex-1 flex-col mb-12">
          {ridesCopy?.length > 0 ? 
          <FlatList
          data={ridesCopy}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRideItem}
          showsVerticalScrollIndicator={false}
        />:
        <Text className='w-full text-center text-black text-xl font-medium'>No Rides Data</Text>}
        </View>
      </View>
      <Loader open={loading} />
    </>
  );
};

export default Rides;
