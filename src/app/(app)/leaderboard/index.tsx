import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  selectAllTotalPaiements,
  useGetTotalPaiementsQuery,
} from "./leaderboardApiSlice";
import { Title, ActivityIndicator } from "react-native-paper";
import { View, FlatList } from "react-native";
import LeaderboardCard from "./LeaderboardCard";
import { useGetUsersQuery } from "../users/usersApiSlice";

export default function Leaderboard() {
  const { isLoading } = useGetTotalPaiementsQuery();
  const { isLoading: isLoadingUsers } = useGetUsersQuery();

  const paiements: TotalPaiement[] = useSelector((state: RootState) =>
    selectAllTotalPaiements(state)
  );

  if (isLoading || isLoadingUsers) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Title className="text-3xl mb-4 font-bold">Leaderboard 🏆</Title>
      <FlatList
        className="w-full"
        data={paiements}
        keyExtractor={(item: TotalPaiement) => item.user as string}
        renderItem={({ item, index }) => (
          <LeaderboardCard index={index} item={item} />
        )}
      />
    </View>
  );
}
