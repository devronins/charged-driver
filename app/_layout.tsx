import { SplashScreen, Stack } from "expo-router";
import "./globals.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";

// Redux & Persist
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/srore";
import { ToastComponent } from "@/components/toast";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "normal-font": require("../assets/fonts/SpaceMono-Regular.ttf")
  })
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack />
        <ToastComponent/>
      </PersistGate>
    </Provider>
  )
}
