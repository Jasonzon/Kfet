import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectAllPresences, useGetPresencesQuery } from "./presencesApiSlice";
import { View, FlatList } from "react-native";
import { Card, Title, Paragraph, ActivityIndicator } from "react-native-paper";

export default function Home() {
  const { isLoading } = useGetPresencesQuery();

  const presences: Presence[] = useSelector((state: RootState) =>
    selectAllPresences(state)
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
      {presences.length === 0 ? (
        <Title className="text-3xl mb-4">La Kfet est fermée 😢</Title>
      ) : (
        <Title className="text-3xl mb-4">La Kfet est ouverte 🔥🔥🔥</Title>
      )}
      {presences.length !== 0 && (
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
      )}
    </View>
  );
}
