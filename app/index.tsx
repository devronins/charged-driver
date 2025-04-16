import { useTypedSelector } from "@/store";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLogin } = useTypedSelector(state => state.Driver);

  if (!isLogin) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(main)/(tabs)/home" />;
}
