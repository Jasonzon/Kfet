import { usePathname } from "expo-router";
import {
  Button,
  Dialog,
  Icon,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
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

  const theme = useTheme();

  return (
    <View className="flex-1">
      <View className="flex-1">
        <Slot />
      </View>
      <View
        className="flex-row justify-around p-4 bg-white-300"
        style={{ backgroundColor: theme.colors.inversePrimary }}
      >
        <Link href="/home">
          <Icon
            source="home-circle"
            size={30}
            color={pathname === "/home" ? theme.colors.backdrop : "white"}
          />
        </Link>
        <Link href="/articles">
          <Icon
            source="food"
            size={30}
            color={pathname === "/articles" ? theme.colors.backdrop : "white"}
          />
        </Link>
        <Link href="/leaderboard">
          <Icon
            source="podium"
            size={30}
            color={
              pathname === "/leaderboard" ? theme.colors.backdrop : "white"
            }
          />
        </Link>
        <Link href="/paiements">
          <Icon
            source="cash"
            size={34}
            color={pathname === "/paiements" ? theme.colors.backdrop : "white"}
          />
        </Link>
        {user?.role && user.role === "admin" && (
          <Link href="/users">
            <Icon
              source="account-group"
              size={30}
              color={pathname === "/users" ? theme.colors.backdrop : "white"}
            />
          </Link>
        )}
        <TouchableOpacity
          onPress={() => setDialog(true)}
          className="translate-y-0.5"
        >
          <Icon source="logout" size={26} color="white" />
        </TouchableOpacity>
        <Portal>
          <Dialog
            visible={dialog}
            onDismiss={() => setDialog(false)}
            style={{ borderRadius: 8 }}
          >
            <Dialog.Title className="font-bold">Déconnexion</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium" className="text-lg">
                Voulez-vous vraiment vous déconnecter ?
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                className="w-16 rounded-lg"
                onPress={() => setDialog(false)}
              >
                Non
              </Button>
              <Button
                mode="contained"
                className="w-16 rounded-lg"
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
