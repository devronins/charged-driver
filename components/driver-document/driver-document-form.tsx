import { useAppDispatch, useTypedSelector } from "@/store";
import { Platform, Text, View } from "react-native";
import { Controller, useForm, yup, yupResolver } from "@/utils/react-hook-form";
import CustomButton from "../ui/CustomButton";
import Icons from "@/constants/icons";
import { DriverDocumentTypesModal } from "@/utils/modals/driver";

// export interface VehicleInfromationFormDataType {
//   car_model: string | undefined;
//   license_plate: string | undefined;
//   car_color: string | undefined;
//   car_year: number | undefined;
//   car_type: string | undefined;
// }

// const getVehicleInfromationFormData = (data: VehicleModal | null) => {
//   return {
//     car_model: data?.car_model || undefined,
//     license_plate: data?.license_plate || undefined,
//     car_color: data?.car_color || undefined,
//     car_year: data?.car_year || undefined,
//     car_type: data?.car_type || undefined,
//   };
// };

// const schema = yup.object().shape({
//   car_model: yup.string().required("Vehicle Model is required"),
//   license_plate: yup.string().required("License Plate is required"),
//   car_color: yup.string().required("Vehicle Color is required"),
//   car_year: yup
//     .number()
//     .required("Vehicle Year is required")
//     .min(1900, "Vehicle Year must be 1900 or later")
//     .max(new Date().getFullYear(), `Vehicle Year cannot be in the future`),
//   car_type: yup
//     .string()
//     .required("Vehicle Type is required")
//     .oneOf(
//       ["suv", "regular", "electric"],
//       "Vehicle Type should be one of the following: suv, regular, or electric."
//     ),
// });

const DriverDocumentFormCard = ({ data }: { data: DriverDocumentTypesModal }) => {
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  //   watch,
  // } = useForm<VehicleInfromationFormDataType>({
  //   defaultValues: getVehicleInfromationFormData(vehicleDetails),
  //   //@ts-ignore
  //   resolver: yupResolver(schema),
  // });

  return (
    <View className="w-full h-auto bg-white rounded-lg flex flex-col items-start gap-5 p-5">
      <View className="w-full flex flex-row items-start justify-between">
        <View className="flex felx-col justify-center w-[70%]">
          <View className="flex flex-row items-center justify-start">
            <Text className="text-lg font-bold">{data.display_name}</Text>
          </View>
          <View className="flex flex-row items-center justify-start mt-1">
            <Text className="line-break text-sm text-text-300 leading-tight">
              {data.description}
            </Text>
          </View>
          {data.is_required ? (
            <View className="flex flex-row items-center justify-start mt-2">
              <Text className=" text-sm text-white px-2 rounded-md bg-primary-300">Required</Text>
            </View>
          ) : null}
        </View>

        <View className="flex flex-row items-center justify-center">
          <Text className="text-sm text-white px-2 py-1 rounded-lg bg-gray-400">Not Submitted</Text>
        </View>
      </View>

      <CustomButton
        title={"Upload"}
        className={`${Platform.OS === "ios" ? "py-4" : "py-[8px]"} gap-2 `}
        onPress={() => {}}
        disabled={false}
        IconLeft={<Icons.Upload color={"#FFFFFF"} size={20} />}
      />
    </View>
  );
};

export default DriverDocumentFormCard;
