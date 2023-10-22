import { Snackbar, TextInput, Button } from "react-native-paper";
import { useAddNewArticleMutation } from "../articlesApiSlice";
import { useState } from "react";
import { View } from "react-native";

export default function NewArticle() {
  const [addNewArticle, { isLoading }] = useAddNewArticleMutation();

  const [nom, setNom] = useState<string>("");
  const [prix, setPrix] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [snackbar, setSnackbar] = useState<string | null>(null);

  async function handleAddNewArticle() {
    try {
      await addNewArticle({ nom, prix, image } as Article).unwrap();
      setSnackbar("Article ajouté !");
      setNom("");
      setPrix("");
      setImage("");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setSnackbar("Erreur, article non ajouté");
    }
  }

  const canSave = [nom, prix, image].every(Boolean) && !isLoading;

  return (
    <View className="p-4 mt-8 flex-1 items-center justify-center">
      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Prix"
        value={prix}
        onChangeText={setPrix}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="URL de l'image"
        value={image}
        onChangeText={setImage}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
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
