import { useAppDispatch, useTypedSelector } from "@/store";
import { useRouter } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Icons from "@/constants/icons";
import { logoutDriver } from "@/services";

const ProfileLogout = () => {
  const { driverDetails, accessToken } = useTypedSelector(state => state.Driver);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logoutDriver({ navigate: () => router.navigate("/(auth)/login") }));
        },
      },
    ]);
  };

  return (
    <View className="w-full h-auto p-7 bg-white rounded-lg flex flex-col items-center">
      <TouchableOpacity className="flex flex-row items-center gap-1" onPress={handleLogout}>
        <View className="flex items-center justify-center">
          <Icons.LogOut color={"#FF3B30"} size={25} />
        </View>
        <View className="flex items-center justify-center">
          <Text className="text-[#FF3B30] font-bold text-[18px]">Logout</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileLogout;
