import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectArticleById,
  useUpdateArticleMutation,
} from "./articlesApiSlice";
import { View } from "react-native";
import { Paragraph, Button, Snackbar } from "react-native-paper";
import { useState } from "react";
import { removeArticle, selectArticle } from "./articleFormSlice";
import ArticleForm from "./ArticleForm";

export default function UserPage() {
  const { article: articleId } = useLocalSearchParams() as {
    article: string;
  };

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const article: Article | undefined = useSelector((state: RootState) =>
    selectArticleById(state, articleId)
  );

  const [updateArticle, { isLoading }] = useUpdateArticleMutation();

  const { id, nom, prix, image } = useSelector(selectArticle);

  const dispatch = useDispatch();

  async function handleUpdateArticle() {
    try {
      await updateArticle({
        nom,
        prix: parseFloat(prix),
        image,
      } as Article).unwrap();
      setSnackbar("Article ajouté !");
      dispatch(removeArticle(undefined));
      router.push("/articles");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setSnackbar("Erreur, article non ajouté");
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
      <ArticleForm />
      <Button
        loading={isLoading}
        className="my-4 w-40"
        mode="contained"
        onPress={handleUpdateArticle}
        disabled={!canSave}
      >
        Ajouter
      </Button>
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
