import { useDispatch, useSelector } from "react-redux";
import { selectAllArticles, useGetArticlesQuery } from "./articlesApiSlice";
import { RootState } from "../../store";
import { FlatList, View } from "react-native";
import {
  Title,
  Button,
  ActivityIndicator,
  Paragraph,
  useTheme,
  TextInput,
  Snackbar,
} from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";
import Article from "./Article";
import { removeCart, selectList, selectTotal } from "./cartSlice";
import { useState } from "react";
import { useAddNewPaiementMutation } from "../paiements/paiementsApiSlice";
import { removeArticle } from "./articleFormSlice";

export default function Articles() {
  const { isLoading } = useGetArticlesQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const articles: Article[] = useSelector((state: RootState) =>
    selectAllArticles(state)
  );

  const cartList = useSelector(selectList);

  const montant = useSelector(selectTotal);

  const total = useSelector(selectTotal);

  const theme = useTheme();

  const [search, setSearch] = useState<string>("");

  const [snackbar, setSnackbar] = useState<string | null>(null);

  const [addNewPaiement, { isLoading: isLoadingPaiement }] =
    useAddNewPaiementMutation();

  async function handleAddPaiement() {
    try {
      await addNewPaiement({
        articles: cartList as string[],
        montant,
      }).unwrap();
      setSnackbar("Commande créée avec succès !");
      dispatch(removeCart(undefined));
      router.push("/paiements");
    } catch (error: any) {
      console.error("Erreur, commande non créée");
      setSnackbar("Erreur, commande non créée");
    }
  }

  const dispatch = useDispatch();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Title className="text-3xl mb-2">Tous les articles</Title>
      {user?.role === "admin" && (
        <Button
          loading={isLoading}
          className="w-40 mb-2"
          mode="contained"
          onPress={() => {
            dispatch(removeArticle(undefined));
            router.push("/articles/new");
          }}
        >
          Ajouter un article
        </Button>
      )}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Rechercher"
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <FlatList
        data={articles.filter((article: Article) =>
          article.nom.includes(search)
        )}
        numColumns={2}
        keyExtractor={(item: Article) => item.id as string}
        renderItem={({ item }) => <Article item={item} />}
      />
      <View className="absolute bottom-4 p-2 flex flex-row gap-2">
        <Button
          mode="contained"
          onPress={() => dispatch(removeCart(undefined))}
        >
          Réinitialiser
        </Button>
        <Paragraph
          className="p-2 rounded-md"
          style={{ backgroundColor: theme.colors.inversePrimary }}
        >
          Total: {total.toFixed(2)}€
        </Paragraph>
        <Button
          loading={isLoadingPaiement}
          mode="contained"
          onPress={handleAddPaiement}
          disabled={montant === 0}
        >
          Commander
        </Button>
      </View>
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
