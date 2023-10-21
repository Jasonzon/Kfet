import { Link, Redirect, Slot } from "expo-router";
import { selectCurrentUser, setUser } from "../auth/authSlice";
import { useSelector } from "react-redux";
import { View, Text } from "react-native";
import { useAuthQuery } from "../auth/authApiSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "expo-router";
import { Icon } from "react-native-paper";

export default function AppLayout() {
  const { data: fetchData, isLoading } = useAuthQuery();

  console.log("data", fetchData);

  const user: User | null = useSelector(selectCurrentUser);

  const pathname = usePathname();

  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchData) {
      dispatch(setUser(fetchData));
    }
  }, [fetchData]);

  if (isLoading) {
    return <Text>Loading layout...</Text>;
  }

  if (!user) {
    return <Redirect href="/connect" />;
  }

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Slot />
      </View>
      <View className="flex-row justify-around p-4 bg-white-300">
        <Link href="/home">
          <Icon
            source="home-circle"
            size={24}
            color={pathname === "/home" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/articles">
          <Icon
            source="food"
            size={24}
            color={pathname === "/articles" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/commander">
          <Icon
            source="swap-vertical"
            size={24}
            color={pathname === "/commander" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/leaderboard">
          <Icon
            source="podium"
            size={24}
            color={pathname === "/leaderboard" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        {user?.role && user.role === "admin" && (
          <Link href="/paiements">
            <Icon
              source="account-credit-card"
              size={24}
              color={pathname === "/paiements" ? "rgb(37 99 235)" : "gray"}
            />
          </Link>
        )}
      </View>
    </View>
  );
}
