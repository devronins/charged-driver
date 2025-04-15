import { useTypedSelector } from "@/srore";
import { Redirect, Stack } from "expo-router";

const Layout = () => {
  const { isLogin } = useTypedSelector(state => state.User);

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
