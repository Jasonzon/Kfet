import { useSelector } from "react-redux";
import { selectAllArticles, useGetArticlesQuery } from "./articlesApiSlice";
import { RootState } from "../../store";
import { FlatList, View, TouchableOpacity, Image } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";

export default function Articles() {
  const { isLoading } = useGetArticlesQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const articles: Article[] = useSelector((state: RootState) =>
    selectAllArticles(state)
  );

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
          onPress={() => router.push("/articles/new")}
        >
          Ajouter un article
        </Button>
      )}
      <FlatList
        data={articles}
        numColumns={2}
        keyExtractor={(item: Article) => item.id as string}
        renderItem={({ item }) => (
          <Card className="m-2 w-40">
            <Card.Content>
              <Title className="text-xl mb-1">{item.nom}</Title>
              <Paragraph className="text-gray-500 mb-1">{item.prix}€</Paragraph>
            </Card.Content>
            <Image
              source={{ uri: item.image }}
              style={{ width: 100, height: 100, resizeMode: "cover" }}
              className="m-1"
            />
          </Card>
        )}
      />
    </View>
  );
}
