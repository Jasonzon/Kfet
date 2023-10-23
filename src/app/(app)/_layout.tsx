import { Redirect } from "expo-router";
import { selectCurrentUser, setUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { View } from "react-native";
import { useAuthQuery } from "../auth/authApiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import BottomNavigation from "./BottomNavigation";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { data: fetchData, isLoading } = useAuthQuery();

  console.log("data", fetchData);

  const user: User | null = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchData && !user) {
      dispatch(setUser(fetchData));
    }
  }, [fetchData]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/connect" />;
  }

  return <BottomNavigation />;
}
