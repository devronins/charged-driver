import { useTypedSelector } from "@/srore";
import { Redirect } from "expo-router";

export default function Index() {
  const { isLogin } = useTypedSelector(state => state.User);

  if (isLogin) return <Redirect href="/(auth)/login" />;

  return <Redirect href="/(main)/(tabs)/home" />;
}
