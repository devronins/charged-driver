import { Stack } from "expo-router";

const Layout = () => {
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
