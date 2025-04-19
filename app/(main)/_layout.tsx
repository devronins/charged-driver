import Icons from "@/constants/icons";
import { VehicleActions } from "@/reducers";
import { useAppDispatch, useTypedSelector } from "@/store";
import { Redirect, Stack } from "expo-router";
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { isLogin } = useTypedSelector(state => state.Driver);
  const { isEditMode } = useTypedSelector(state => state.Vehicle);

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/vehicle-infromation"
        //@ts-ignore
        options={({ navigation }) => ({
          headerTitle: "Vehicle Information",
          headerTitleAlign: "center", // for android
          headerTitleStyle: {
            color: "#007FFF",
            paddingLeft: 0,
            text: "center",
          },
          headerLeft: () => (
            <TouchableOpacity
              className="w-[90px] h-10 flex items-start justify-center px-1"
              onPress={() => navigation.goBack()}
            >
              <Icons.ChevronLeft size={30} color="#5A5660" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-[90px] h-10 flex items-end justify-center px-2"
              onPress={() => {
                dispatch(VehicleActions.setIsEditMode({ status: !isEditMode }));
              }}
            >
              <Text className="text-primary-300">{isEditMode ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="profile/driver-document"
        //@ts-ignore
        options={({ navigation }) => ({
          headerTitle: "Documents",
          headerTitleAlign: "center", // for android
          headerTitleStyle: {
            color: "#007FFF",
            paddingLeft: 0,
            text: "center",
          },
          headerLeft: () => (
            <TouchableOpacity
              className="w-[90px] h-10 flex items-start justify-center px-1"
              onPress={() => navigation.goBack()}
            >
              <Icons.ChevronLeft size={30} color="#5A5660" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  );
};

export default Layout;
