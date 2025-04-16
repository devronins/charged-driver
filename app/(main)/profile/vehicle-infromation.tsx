import { useAppDispatch, useTypedSelector } from "@/store";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { Controller, useForm, yup, yupResolver } from "@/utils/react-hook-form";
import Icons from "@/constants/icons";
import InputField from "@/components/ui/InputField";

export interface LoginFormDataType {
  email: string;
  password: string;
}

const loginFormData: LoginFormDataType = {
  email: "",
  password: "",
};

const schema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
  password: yup.string().min(6, "Password length should be min 6").required("Password is required"),
});

const VehicleInfromation = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormDataType>({
    defaultValues: {
      email: loginFormData?.email || "",
      password: loginFormData?.password || "",
    },
    resolver: yupResolver(schema),
  });

  const { driverDetails, accessToken } = useTypedSelector(state => state.Driver);
  const dispatch = useAppDispatch();
  const router = useRouter();

  console.log("profile screen>>>>>>>", driverDetails, accessToken);

  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className=" flex-1 flex flex-col items-center p-6 gap-5">
        <View className="w-full h-auto bg-white rounded-lg flex flex-col items-center gap-5 p-5">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                keyboardType="email-address"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                editable={true}
                error={undefined}
              />
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default VehicleInfromation;
