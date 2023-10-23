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
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Title className="text-3xl mb-4">Leaderboard 🏆</Title>
      <FlatList
        className="w-full"
        data={paiements}
        keyExtractor={(item: TotalPaiement) => item.user as string}
        renderItem={({ item, index }) => (
          <Card className="w-full">
            <Card.Content>
              <View className="flex flex-row justify-between">
                <Title className="text-xl mb-2">{item.user}</Title>
                <Title className="text-3xl">N°{index + 1}</Title>
              </View>
              <Paragraph className="text-gray-500 mb-2 text-xl">
                {item.montant}€
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
