import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/store/authStore";

export default function Index() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return accessToken ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}