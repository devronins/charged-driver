import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView className=" bg-secondary-300">
      <View className="min-h-screen w-full flex flex-col items-center justify-center">
        <Text className="text-4xl text-black">Home</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
