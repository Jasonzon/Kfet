import { usePathname } from "expo-router";
import { Button, Dialog, Icon, Portal, Text } from "react-native-paper";
import { Link, Slot } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../auth/authSlice";
import { useState } from "react";
import { removeToken } from "../../utils/token";

export default function BottomNavigation() {
  const user: User | null = useSelector(selectCurrentUser);

  const pathname = usePathname();

  const [dialog, setDialog] = useState<boolean>(false);

  const dispatch = useDispatch();

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
        <Link href="/paiements">
          <Icon
            source="cash-check"
            size={24}
            color={pathname === "/paiements" ? "rgb(37 99 235)" : "gray"}
          />
        </Link>
        {user?.role && user.role === "admin" && (
          <Link href="/users">
            <Icon
              source="account-group"
              size={24}
              color={pathname === "/users" ? "rgb(37 99 235)" : "gray"}
            />
          </Link>
        )}
        <TouchableOpacity onPress={() => setDialog(true)}>
          <Icon source="logout" size={24} color="rgb(239 68 68)" />
        </TouchableOpacity>
        <Portal>
          <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
            <Dialog.Title>Déconnexion</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Voulez-vous vraiment vous déconnecter ?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialog(false)}>Non</Button>
              <Button
                onPress={async () => {
                  await removeToken();
                  dispatch(logOut(undefined));
                }}
              >
                Oui
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
}
