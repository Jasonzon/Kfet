import { useSelector } from "react-redux";
import { selectAllArticles, useGetArticlesQuery } from "./articlesApiSlice";
import { RootState } from "../../store";
import { FlatList, Text, View } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

export default function Articles() {
  const { isLoading } = useGetArticlesQuery();

  const offres: Article[] = useSelector((state: RootState) =>
    selectAllArticles(state)
  );

  if (isLoading) {
    return <Text>Chargement des articles...</Text>;
  }

  return (
    <View className="flex-1 p-4">
      <Title className="text-3xl mb-4">Tous les articles</Title>
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
