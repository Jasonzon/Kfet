import { useDispatch, useSelector } from "react-redux";
import { selectAllArticles, useGetArticlesQuery } from "./articlesApiSlice";
import { RootState } from "../../store";
import { FlatList, View } from "react-native";
import {
  Title,
  Button,
  ActivityIndicator,
  Paragraph,
  TextInput,
  Snackbar,
  IconButton,
  useTheme,
} from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";
import Article from "./Article";
import { removeCart, selectCart } from "./cartSlice";
import { useState } from "react";
import { useAddNewPaiementMutation } from "../paiements/paiementsApiSlice";
import { removeArticle } from "./articleFormSlice";

export default function Articles() {
  const { isLoading } = useGetArticlesQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const articles: Article[] = useSelector((state: RootState) =>
    selectAllArticles(state)
  );

  const cart = useSelector(selectCart);

  const cartList = cart.map((article: Article) => article.id);

  const montant = cart.reduce((acc, article) => acc + article.prix, 0);

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

  const theme = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4 relative">
      <Title className="text-3xl mb-4 font-bold">Articles</Title>
      {user?.role === "admin" && (
        <IconButton
          icon="plus"
          size={30}
          className="absolute top-2 right-2 rounded-lg"
          iconColor="white"
          style={{ backgroundColor: theme.colors.primary }}
          onPress={() => {
            dispatch(removeArticle(undefined));
            router.push("/articles/new");
          }}
        />
      )}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Rechercher"
        className="bg-white border rounded-md px-4 py-0.5 mb-2 w-80"
      />
      <FlatList
        data={articles.filter((article: Article) =>
          article.nom.toLowerCase().includes(search.toLowerCase())
        )}
        numColumns={2}
        keyExtractor={(item: Article) => item.id as string}
        renderItem={({ item }) => <Article item={item} />}
      />
      <View className="absolute bottom-2 flex-row gap-2 flex-1 -translate-x-1">
        <Button
          mode="contained"
          onPress={() => dispatch(removeCart(undefined))}
          className="rounded-lg"
        >
          <Paragraph className="font-bold text-white">Réinitialiser</Paragraph>
        </Button>
        <Paragraph className="font-bold text-lg translate-y-1.5">
          Total: {montant.toFixed(2)}€
        </Paragraph>
        <Button
          loading={isLoadingPaiement}
          mode="contained"
          onPress={handleAddPaiement}
          disabled={montant === 0}
          className="rounded-lg"
        >
          <Paragraph className="font-bold text-white">Commander</Paragraph>
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
