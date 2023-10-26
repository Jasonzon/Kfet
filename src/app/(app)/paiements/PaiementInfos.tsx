import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersApiSlice";
import { RootState } from "../../store";
import { View, FlatList } from "react-native";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  Snackbar,
  Text,
} from "react-native-paper";
import Article from "./Article";
import {
  useDeletePaiementMutation,
  useUpdatePaiementMutation,
} from "./paiementsApiSlice";
import { useState } from "react";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";

interface PaiementInfosProps {
  paiement: Paiement;
}

export default function PaiementInfos({ paiement }: PaiementInfosProps) {
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const currentUser: User | null = useSelector(selectCurrentUser) as User;

  const [dialogDelete, setDialogDelete] = useState<boolean>(false);
  const [dialogUpdate, setDialogUpdate] = useState<boolean>(false);

  const [updatePaiement, { isLoading: isLoadingUpdate }] =
    useUpdatePaiementMutation();

  const [deletePaiement, { isLoading: isLoadingDelete }] =
    useDeletePaiementMutation();

  async function handleUpdatePaiement() {
    try {
      await updatePaiement({ id: paiement.id }).unwrap();
      setSnackbar("Paiement validé !");
      router.push("/paiements");
    } catch (error: any) {
      console.error("Erreur, paiement non validé");
      setSnackbar("Erreur, paiement non validé");
    } finally {
      setDialogUpdate(false);
    }
  }

  async function handleDeletePaiement() {
    try {
      await deletePaiement({ paiementId: paiement.id }).unwrap();
      setSnackbar("Commande supprimée !");
      router.push("/paiements");
    } catch (error: any) {
      console.error("Erreur, commande non supprimée");
      setSnackbar("Erreur, commande non supprimée");
    } finally {
      setDialogDelete(false);
    }
  }

  const user: User | undefined = useSelector((state: RootState) =>
    selectUserById(state, paiement?.user)
  ) as User;

  return (
    <View className="flex-1 items-center justify-center p-4 mt-40">
      <Paragraph className="text-3xl font-bold mb-2">
        {user.prenom} {user.nom}
      </Paragraph>
      <Paragraph className="text-xl font-bold mb-4">
        {paiement.montant}€
      </Paragraph>
      <FlatList<string>
        className="w-full mt-2"
        data={paiement.articles}
        keyExtractor={(item: string, index: number) => index.toString()}
        renderItem={({ item }) => <Article item={item} />}
      />
      <View className="flex flex-column items-center justify-evenly mb-2">
        <Paragraph className="text-xl">
          Envoyé le{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(paiement.envoi))}
        </Paragraph>
        {paiement.validation && (
          <Paragraph className="text-xl">
            Validé le{" "}
            {new Intl.DateTimeFormat("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(paiement.validation))}
          </Paragraph>
        )}
      </View>
      {!paiement.validation && (
        <View className="flex flex-row gap-2">
          {currentUser.id === user.id && (
            <Button
              loading={isLoadingDelete}
              className="my-4 w-40 rounded-lg"
              mode="contained"
              onPress={() => setDialogDelete(true)}
            >
              Supprimer
            </Button>
          )}
          {currentUser.role === "admin" && (
            <Button
              loading={isLoadingUpdate}
              className="my-4 w-40 rounded-lg"
              mode="contained"
              onPress={() => setDialogUpdate(true)}
            >
              Valider
            </Button>
          )}
        </View>
      )}
      <Portal>
        <Dialog
          visible={dialogDelete}
          onDismiss={() => setDialogDelete(false)}
          style={{ borderRadius: 8 }}
        >
          <Dialog.Title className="font-bold">Suppression</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" className="text-lg">
              Voulez-vous vraiment supprimer la commande ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              className="w-16 rounded-lg"
              onPress={() => setDialogDelete(false)}
            >
              Non
            </Button>
            <Button
              mode="contained"
              className="w-16 rounded-lg"
              onPress={handleDeletePaiement}
            >
              Oui
            </Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={dialogUpdate}
          onDismiss={() => setDialogUpdate(false)}
          style={{ borderRadius: 8 }}
        >
          <Dialog.Title className="font-bold">Validation</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" className="text-lg">
              Voulez-vous vraiment valider le paiement ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              className="w-16 rounded-lg"
              onPress={() => setDialogUpdate(false)}
            >
              Non
            </Button>
            <Button
              mode="contained"
              className="w-16 rounded-lg"
              onPress={handleUpdatePaiement}
            >
              Oui
            </Button>
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
