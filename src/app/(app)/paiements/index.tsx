import { useSelector } from "react-redux";
import { selectAllPaiements, useGetPaiementsQuery } from "./paiementsApiSlice";
import { RootState } from "../../store";
import { Paragraph, Title, Card, ActivityIndicator } from "react-native-paper";
import { View, FlatList } from "react-native";

export default function Paiements() {
  const { isLoading } = useGetPaiementsQuery();

  const paiements: Paiement[] = useSelector((state: RootState) =>
    selectAllPaiements(state)
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
      <Title className="text-3xl mb-4">Paiements</Title>
      <FlatList
        data={paiements}
        keyExtractor={(item: Paiement) => item.id as string}
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
