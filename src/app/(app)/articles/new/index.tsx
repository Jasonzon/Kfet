import { Snackbar, Button } from "react-native-paper";
import { useAddNewArticleMutation } from "../articlesApiSlice";
import { useState } from "react";
import { View } from "react-native";
import ArticleForm from "../ArticleForm";
import { useDispatch, useSelector } from "react-redux";
import { removeArticle, selectArticle } from "../articleFormSlice";

export default function NewArticle() {
  const [addNewArticle, { isLoading }] = useAddNewArticleMutation();

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { nom, prix, image } = useSelector(selectArticle);

  async function handleAddNewArticle() {
    try {
      await addNewArticle({ nom, prix, image } as Article).unwrap();
      setSnackbar("Article ajouté !");
      dispatch(removeArticle(undefined));
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setSnackbar("Erreur, article non ajouté");
    }
  }

  const canSave = [nom, prix, image].every(Boolean) && !isLoading;

  return (
    <View className="p-4 mt-8 flex-1 items-center justify-center">
      <ArticleForm />
      <Button
        loading={isLoading}
        className="my-4 w-40"
        mode="contained"
        onPress={handleAddNewArticle}
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
