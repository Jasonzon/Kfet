import { useSelector } from "react-redux";
import { selectAllArticles, useGetArticlesQuery } from "./articlesApiSlice";
import { RootState } from "../../store";
import { FlatList, View, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";

export default function Articles() {
  const { isLoading } = useGetArticlesQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const offres: Article[] = useSelector((state: RootState) =>
    selectAllArticles(state)
  );

  if (isLoading) {
    return <Paragraph>Chargement des articles...</Paragraph>;
  }

  return (
    <View className="flex-1 p-4">
      <Title className="text-3xl mb-4">Tous les articles</Title>
      {user?.role === "admin" && (
        <TouchableOpacity onPress={() => router.push("/articles/new")}>
          <Paragraph>Ajouter un article</Paragraph>
        </TouchableOpacity>
      )}
      <FlatList
        data={offres}
        keyExtractor={(item: Article) => item.id as string}
        renderItem={({ item }) => (
          <Card className="my-4">
            <Card.Content>
              <Title className="text-xl mb-2">{item.nom}</Title>
              <Paragraph className="text-gray-500 mb-2">{item.prix}</Paragraph>
            </Card.Content>
            <Card.Cover source={{ uri: item.image }} />
          </Card>
        )}
      />
    </View>
  );
}
