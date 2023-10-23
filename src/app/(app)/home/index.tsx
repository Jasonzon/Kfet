import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectAllPresences,
  useAddNewPresenceMutation,
  useGetPresencesQuery,
  useUpdatePresenceMutation,
} from "./presencesApiSlice";
import { View, FlatList } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Button,
  Portal,
  Dialog,
  Text,
  Snackbar,
} from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { useState } from "react";

export default function Home() {
  const { isLoading } = useGetPresencesQuery();

  const presences: PresenceJoined[] = useSelector((state: RootState) =>
    selectAllPresences(state)
  );

  const user: User | null = useSelector(selectCurrentUser);

  const [addNewPresence, { isLoading: isLoadingPresence }] =
    useAddNewPresenceMutation();

  const [updatePresence, { isLoading: isLoadingPresence2 }] =
    useUpdatePresenceMutation();

  async function handleAddNewPresence() {
    try {
      await addNewPresence().unwrap();
      setSnackbar("Présence ajoutée !");
    } catch (error: any) {
      console.error("Erreur", error.message);
      setSnackbar("Erreur, présence non ajoutée");
    } finally {
      setPresence(false);
    }
  }

  async function handleUpdatePresence() {
    try {
      await updatePresence({
        fin: new Date(),
        id: presences.find((presence: Presence) => presence.user === user!.id)
          ?.id,
      }).unwrap();
      setSnackbar("Présence mise à jour !");
    } catch (error: any) {
      console.error("Erreur", error.message);
      setSnackbar("Erreur, présence non mise à jour");
    } finally {
      setPresence2(false);
    }
  }

  const [presence, setPresence] = useState<boolean>(false);
  const [presence2, setPresence2] = useState<boolean>(false);

  const [snackbar, setSnackbar] = useState<string | null>(null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      {presences.length === 0 ? (
        <Title className="text-3xl mb-4">La Kfet est fermée 😢</Title>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Title className="text-3xl">La Kfet est ouverte 🔥</Title>
          <Paragraph className="text-lg">
            Membres de la team présents :
          </Paragraph>
        </View>
      )}
      {user?.role === "admin" && (
        <>
          {!presences.some(
            (presence: Presence) => presence.user === user.id
          ) ? (
            <Button
              loading={isLoadingPresence}
              className="my-4 w-40"
              mode="contained"
              onPress={() => setPresence(true)}
            >
              Je suis présent
            </Button>
          ) : (
            <Button
              loading={isLoadingPresence2}
              className="my-4 w-40"
              mode="contained"
              onPress={() => setPresence2(true)}
            >
              Je pars
            </Button>
          )}
        </>
      )}
      {presences.length !== 0 && (
        <FlatList
          data={presences}
          className="w-full"
          keyExtractor={(item: PresenceJoined) => item.id as string}
          renderItem={({ item }) => (
            <Card className="w-full">
              <Card.Content>
                <Title className="text-xl mb-1">
                  {item.prenom} {item.nom}
                </Title>
                <Paragraph className="text-gray-500 mb-2">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(item.debut))}
                </Paragraph>
              </Card.Content>
            </Card>
          )}
        />
      )}
      <Portal>
        <Dialog visible={presence} onDismiss={() => setPresence(false)}>
          <Dialog.Title>Présence à la Kfet</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Vous êtes vraiment présent à la Kfet ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPresence(false)}>Non</Button>
            <Button onPress={handleAddNewPresence}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={presence2} onDismiss={() => setPresence2(false)}>
          <Dialog.Title>Présence à la Kfet</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Vous partez vraiment de la Kfet ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPresence2(false)}>Non</Button>
            <Button onPress={handleUpdatePresence}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
