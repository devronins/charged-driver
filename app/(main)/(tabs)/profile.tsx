import { logoutUser } from "@/services";
import { useAppDispatch } from "@/srore";
import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = () => {
    dispatch(
      logoutUser({
        navigate: () => router.navigate("/(auth)/login"),
      })
    );
  };
  return (
    <SafeAreaView className=" bg-secondary-300">
      <View className="min-h-screen w-full flex flex-col items-center justify-center">
        <Text onPress={() => handleLogout()} className="text-4xl text-black">
          Profile
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
