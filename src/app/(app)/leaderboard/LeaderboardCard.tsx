import { ActivityIndicator, Card, Paragraph, Title } from "react-native-paper";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectUserById, useGetUsersQuery } from "../users/usersApiSlice";

interface LeaderboardProps {
  item: TotalPaiement;
  index: number;
}

export default function LeaderboardCard({ item, index }: LeaderboardProps) {
  const { isLoading } = useGetUsersQuery();

  const user: User | undefined = useSelector((state: RootState) =>
    selectUserById(state, item.user)
  ) as User;

  function background(index: number) {
    switch (index) {
      case 0:
        return "bg-yellow-300";
      case 1:
        return "bg-gray-400";
      case 2:
        return "bg-orange-800";
      default:
        return "";
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Card className={`w-full ${background(index)}`}>
      <Card.Content>
        <View className="flex flex-row justify-between">
          <Title className="text-xl font-bold">{`${user.prenom} ${user.nom
            .slice(0, 1)
            .toUpperCase()}.`}</Title>
          <Title className="text-3xl">N°{index + 1}</Title>
        </View>
        <Paragraph className="text-xl text-gray-800">{item.total}€</Paragraph>
      </Card.Content>
    </Card>
  );
}
