import { useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectPaiementById, useGetPaiementsQuery } from "./paiementsApiSlice";
import { View } from "react-native";
import { Paragraph, ActivityIndicator } from "react-native-paper";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetArticlesQuery } from "../articles/articlesApiSlice";
import PaiementInfos from "./PaiementInfos";

export default function UserPage() {
  const { paiement: paiementId } = useLocalSearchParams() as {
    paiement: string;
  };

  const { isLoading: isLoadingPaiements } = useGetPaiementsQuery();

  const paiement: Paiement | undefined = useSelector((state: RootState) =>
    selectPaiementById(state, paiementId)
  );

  const { isLoading: isLoadingUsers } = useGetUsersQuery();

  const { isLoading: isLoadingArticles } = useGetArticlesQuery();

  if (isLoadingUsers || isLoadingArticles || isLoadingPaiements) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  if (!paiement) {
    return (
      <View className="flex-1 items-center justify-center">
        <Paragraph>Erreur, commande non trouvée</Paragraph>
      </View>
    );
  }

  return <PaiementInfos paiement={paiement} />;
}
