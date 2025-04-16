import Icons from "@/constants/icons";
import { useTypedSelector } from "@/store";
import { Redirect, Stack } from "expo-router";

const Layout = () => {
  const { isLogin } = useTypedSelector(state => state.Driver);

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
          headerTitleStyle: {
            color: "#007FFF",
            paddingLeft: 0,
          },
          headerLeft: () => (
            <Icons.ChevronLeft onPress={() => navigation.goBack()} size={30} color="#5A5660" />
          ),
        })}
      />
    </Stack>
  );
};

export default Layout;
