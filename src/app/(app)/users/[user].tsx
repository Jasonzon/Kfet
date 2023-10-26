import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectUserById,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "./usersApiSlice";
import { View } from "react-native";
import {
  Paragraph,
  Button,
  Snackbar,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useState } from "react";
import { selectCurrentUser } from "../../auth/authSlice";

export default function UserPage() {
  const { user: userId } = useLocalSearchParams() as {
    user: string;
  };

  const { isLoading: isLoadingUsers } = useGetUsersQuery();

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const [updateUser, { isLoading: isLoadingUpdate }] = useUpdateUserMutation();

  const currentUser: User | null = useSelector(selectCurrentUser);

  const user: User | undefined = useSelector((state: RootState) =>
    selectUserById(state, userId)
  );

  async function handleUpdateUser(role: "admin" | "basic") {
    try {
      await updateUser({ ...user, role }).unwrap();
      setSnackbar("Utilisateur mis à jour !");
    } catch (error: any) {
      console.error("Erreur, utilisateur non mis à jour");
      setSnackbar("Erreur, utilisateur non mis à jour");
    }
  }

  const theme = useTheme();

  if (isLoadingUsers) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Paragraph>Erreur, utilisateur non trouvé</Paragraph>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Paragraph className="text-3xl font-bold mb-2">
        {user.prenom} {user.nom}
      </Paragraph>
      <Paragraph className="text-xl font-bold mb-4">{user.mail}</Paragraph>
      <Paragraph className="text-xl font-bold mb-2">{user.tel}</Paragraph>
      <Paragraph
        className="text-xl font-bold text-white p-2 rounded-lg"
        style={{ backgroundColor: theme.colors.inversePrimary }}
      >
        {user.role === "admin" ? "Team Kfet" : "Client"}
      </Paragraph>
      {currentUser?.id !== user.id && (
        <>
          {user.role === "admin" ? (
            <Button
              loading={isLoadingUpdate}
              className="mb-2"
              mode="contained"
              onPress={() => handleUpdateUser("basic")}
            >
              Enlever de la team Kfet
            </Button>
          ) : (
            <Button
              loading={isLoadingUpdate}
              className="mb-2"
              mode="contained"
              onPress={() => handleUpdateUser("admin")}
            >
              Ajouter à la team Kfet
            </Button>
          )}
        </>
      )}
      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => setSnackbar(null)}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
    </View>
  );
}
