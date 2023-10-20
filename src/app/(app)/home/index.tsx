import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectAllPresences, useGetPresencesQuery } from "./presencesApiSlice";
import { View, FlatList } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";

export default function Home() {
  const { isLoading } = useGetPresencesQuery();

  const presences: Presence[] = useSelector((state: RootState) =>
    selectAllPresences(state)
  );

  if (isLoading) {
    return <Paragraph>Chargement des présences...</Paragraph>;
  }

  return (
    <View className="flex-1 p-4">
      <Title className="text-3xl mb-4">Présences à la Kfet</Title>
      {presences.length === 0 ? (
        <Paragraph>La Kfet est fermée 😢</Paragraph>
      ) : (
        <Paragraph>La Kfet est ouverte 🔥🔥🔥</Paragraph>
      )}
      <FlatList
        data={presences}
        keyExtractor={(item: Presence) => item.id as string}
        renderItem={({ item }) => (
          <Card className="my-4">
            <Card.Content>
              <Title className="text-xl mb-2">{item.user.prenom}</Title>
              <Paragraph className="text-gray-500 mb-2">
                {new Intl.DateTimeFormat("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(item.debut))}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
