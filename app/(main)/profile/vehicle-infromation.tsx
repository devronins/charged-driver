import { ScrollView, View } from "react-native";
import VehicleInfromationForm from "@/components/vehicle-infromation/vehicle-infromation-form";
import VehicleInfromationInfo from "@/components/vehicle-infromation/vehicle-infromation-info";
import { useAppDispatch, useTypedSelector } from "@/store";
import { useEffect } from "react";
import { getVehicleDetails } from "@/services/vehicle";
import Loader from "@/components/ui/Loader";

const VehicleInfromation = () => {
  const { vehicleDetailsLoading, isEditMode } = useTypedSelector(state => state.Vehicle);
  const { driverDetails, accessToken } = useTypedSelector(state => state.Driver);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getVehicleDetails({}));
  }, []);

  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className=" flex-1 flex flex-col items-center p-6 gap-5">
        <VehicleInfromationInfo />
        <VehicleInfromationForm />
      </View>
      <Loader open={vehicleDetailsLoading} />
    </ScrollView>
  );
};

export default VehicleInfromation;
