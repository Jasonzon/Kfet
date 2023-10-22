import { usePathname } from "expo-router";
import { Icon } from "react-native-paper";
import { Link, Slot } from "expo-router";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";

export default function Router() {
  const user: User | null = useSelector(selectCurrentUser);

  const pathname = usePathname();

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
              source="cash-check"
              size={24}
              color={pathname === "/paiements" ? "rgb(37 99 235)" : "gray"}
            />
          </Link>
        )}
        {user?.role && user.role === "admin" && (
          <Link href="/users">
            <Icon
              source="account-group"
              size={24}
              color={pathname === "/users" ? "rgb(37 99 235)" : "gray"}
            />
          </Link>
        )}
      </View>
    </View>
  );
}
