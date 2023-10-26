import { Snackbar, Button, Title, Paragraph } from "react-native-paper";
import { useAddNewArticleMutation } from "../articlesApiSlice";
import { useState } from "react";
import { View, Image } from "react-native";
import ArticleForm from "../ArticleForm";
import { useDispatch, useSelector } from "react-redux";
import { removeArticle, selectArticle } from "../articleFormSlice";
import { useKeyboard } from "@react-native-community/hooks";

export default function NewArticle() {
  const [addNewArticle, { isLoading }] = useAddNewArticleMutation();

  const keyboard = useKeyboard();

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const dispatch = useDispatch();

  const { nom, prix, image } = useSelector(selectArticle);

  async function handleAddNewArticle() {
    try {
      await addNewArticle({
        nom,
        prix: parseFloat(prix),
        image,
      } as Article).unwrap();
      setSnackbar("Article ajouté !");
      dispatch(removeArticle(undefined));
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setSnackbar("Erreur, article non ajouté");
    }
  }

  const canSave =
    [nom, prix, image].every(Boolean) &&
    !isLoading &&
    /^\d+(\.\d+)?$/.test(prix);

  return (
    <View className="p-4 mt-8 flex-1 items-center justify-center">
      <Title className="text-3xl font-bold mb-4">Nouvel article</Title>
      <ArticleForm />
      <Button
        loading={isLoading}
        className="my-4 w-40 rounded-lg"
        mode="contained"
        onPress={handleAddNewArticle}
        disabled={!canSave}
      >
        <Paragraph className="font-bold text-white w-40">Ajouter</Paragraph>
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
