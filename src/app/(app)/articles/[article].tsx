import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectAllArticles,
  selectArticleById,
  useDeleteArticleMutation,
  useGetArticlesQuery,
  useUpdateArticleMutation,
} from "./articlesApiSlice";
import { View, Image } from "react-native";
import {
  Paragraph,
  Button,
  Snackbar,
  Title,
  Portal,
  Dialog,
  Text,
} from "react-native-paper";
import { useState } from "react";
import { removeArticle, selectArticle } from "./articleFormSlice";
import ArticleForm from "./ArticleForm";
import { selectCurrentUser } from "../../auth/authSlice";

export default function UserPage() {
  const { article: articleId } = useLocalSearchParams() as {
    article: string;
  };

  const { isLoading: isLoadingArticles } = useGetArticlesQuery();

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const article: Article | undefined = useSelector((state: RootState) =>
    selectArticleById(state, articleId)
  );

  const [updateArticle, { isLoading }] = useUpdateArticleMutation();

  const [deleteArticle, { isLoading: isLoadingDelete }] =
    useDeleteArticleMutation();

  const { id, nom, prix, image } = useSelector(selectArticle);

  const dispatch = useDispatch();

  const [dialog, setDialog] = useState<boolean>(false);

  const user: User | null = useSelector(selectCurrentUser) as User;

  async function handleUpdateArticle() {
    try {
      await updateArticle({
        nom,
        prix: parseFloat(prix),
        image,
        id,
      } as Article).unwrap();
      setSnackbar("Article ajouté !");
      dispatch(removeArticle(undefined));
      router.push("/articles");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setSnackbar("Erreur, article non ajouté");
    }
  }

  async function handleDeleteArticle() {
    try {
      await deleteArticle({
        articleId: id,
      }).unwrap();
      setSnackbar("Article supprimé !");
      router.push("/articles");
    } catch (error: any) {
      console.error("Erreur, article non supprimé");
      setSnackbar("Erreur, article non supprimé");
    } finally {
      setDialog(false);
    }
  }

  const canSave =
    [id, prix, image, nom].every(Boolean) &&
    !isLoading &&
    /^\d+(\.\d+)?$/.test(prix);

  if (!article) {
    return (
      <View className="flex-1 items-center justify-center">
        <Paragraph>Erreur, article non trouvé</Paragraph>
      </View>
    );
  }

  return (
    <View className="p-4 mt-8 flex-1 items-center justify-center">
      <View className="flex items-center justify-center">
        <Title className="text-3xl">{nom}</Title>
        <Paragraph className="text-xl">{prix}€</Paragraph>
        <Image source={{ uri: image }} className="w-48 h-48" />
      </View>
      {user.role === "admin" && (
        <>
          <ArticleForm />
          <View className="flex flex-row gap-2">
            <Button
              loading={isLoadingDelete}
              className="my-4 w-40"
              mode="contained"
              onPress={() => setDialog(true)}
            >
              Supprimer
            </Button>
            <Button
              loading={isLoading}
              className="my-4 w-40"
              mode="contained"
              onPress={handleUpdateArticle}
              disabled={!canSave}
            >
              Mettre à jour
            </Button>
          </View>
        </>
      )}
      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => setSnackbar(null)}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
      <Portal>
        <Dialog visible={dialog} onDismiss={() => setDialog(false)}>
          <Dialog.Title>Suppression</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Voulez-vous vraiment supprimer l'article "{nom}" ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialog(false)}>Non</Button>
            <Button onPress={handleDeleteArticle}>Oui</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
