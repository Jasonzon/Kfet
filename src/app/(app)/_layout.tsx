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
  //const { data: fetchData, isLoading } = useAuthQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const pathname = usePathname();

  /*
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchData) {
      dispatch(setUser(fetchData));
    }
  }, [fetchData]);

  if (isLoading) {
    return <Text>Loading layout...</Text>;
  }
  */

  if (user) {
    return <Redirect href="/connect" />;
  }

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Slot />
      </View>
      <View className="flex-row justify-around p-4 bg-white-300">
        <Link href="/offers">
          <Icon
            source="ab-testing"
            size={24}
            color={pathname === "/offers" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/messages">
          <Icon
            source="ab-testing"
            size={24}
            color={pathname === "/messages" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/add">
          <Icon
            source="ab-testing"
            size={24}
            color={pathname === "/add" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        <Link href="/profile">
          <Icon
            source="ab-testing"
            size={24}
            color={pathname === "/profile" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
      </View>
    </View>
  );
}
