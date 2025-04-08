import { Stack } from "expo-router";
import { PermissionTypeEnum } from "@/reducers";
import { useAppDispatch, useTypedSelector } from "@/srore";
import { useEffect, useRef } from "react";
import { requestBackgroundLocationAccess } from "@/services/permission";
import { AppState } from "react-native";

const Layout = () => {
  const dispatch = useAppDispatch();
  const { location } = useTypedSelector(state => state.Permission);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // First time request if undetermined
    if (location.grantedBackground === PermissionTypeEnum.UNDETERMINED) {
      dispatch(requestBackgroundLocationAccess());
    }

    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        console.log("📲 App returned to foreground, rechecking permission...");
        dispatch(requestBackgroundLocationAccess());
      }

      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

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
