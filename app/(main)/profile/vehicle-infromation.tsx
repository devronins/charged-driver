import { ScrollView, View } from 'react-native';
import VehicleInfromationForm from '@/components/vehicle-infromation/vehicle-infromation-form';
import VehicleInfromationInfo from '@/components/vehicle-infromation/vehicle-infromation-info';
import { useAppDispatch, useTypedSelector } from '@/store';
import { useEffect } from 'react';
import { getVehicleDetails } from '@/services/vehicle';
import Loader from '@/components/ui/Loader';
import { getRideTypes } from '@/services';

const VehicleInfromation = () => {
  const { vehicleDetailsLoading } = useTypedSelector((state) => state.Vehicle);
  const { loading } = useTypedSelector((state) => state.Ride);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getVehicleDetails({}));
    dispatch(getRideTypes({}));
  }, []);

  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className=" flex-1 flex flex-col items-center p-6 gap-5">
        <VehicleInfromationInfo />
        <VehicleInfromationForm />
      </View>
      <Loader open={vehicleDetailsLoading || loading} />
    </ScrollView>
  );
};

export default VehicleInfromation;
