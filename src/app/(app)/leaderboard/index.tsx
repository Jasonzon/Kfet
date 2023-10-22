import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectAllTotalPaiements,
  useGetTotalPaiementsQuery,
} from "./leaderboardApiSlice";
import { Paragraph, Card, Title, ActivityIndicator } from "react-native-paper";
import { View, FlatList } from "react-native";

export default function Leaderboard() {
  const { isLoading } = useGetTotalPaiementsQuery();

  const paiements: TotalPaiement[] = useSelector((state: RootState) =>
    selectAllTotalPaiements(state)
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Title className="text-3xl mb-4">Leaderboard</Title>
      <FlatList
        data={paiements}
        keyExtractor={(item: TotalPaiement) => item.user.id as string}
        renderItem={({ item }) => (
          <Card className="my-4">
            <Card.Content>
              <Title className="text-xl mb-2">{`${
                item.user.prenom
              } ${item.user.nom.slice(0, 1)}.`}</Title>
              <Paragraph className="text-gray-500 mb-2">
                {item.montant}
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
