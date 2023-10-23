import { useSelector } from "react-redux";
import { selectAllPaiements, useGetPaiementsQuery } from "./paiementsApiSlice";
import { RootState } from "../../store";
import { Title, ActivityIndicator, useTheme } from "react-native-paper";
import { View, FlatList } from "react-native";
import { selectCurrentUser } from "../../auth/authSlice";
import Paiement from "./Paiement";
import { Select, CheckIcon } from "native-base";
import { useState } from "react";

export default function Paiements() {
  const { isLoading } = useGetPaiementsQuery();

  const paiements: PaiementJoined[] = useSelector((state: RootState) =>
    selectAllPaiements(state)
  );

  const user: User | null = useSelector(selectCurrentUser);

  const theme = useTheme();

  const [payments, setPayments] = useState<"soi" | "tous">("soi");

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
      {user?.role === "admin" && (
        <Select
          selectedValue={payments}
          minWidth="300"
          accessibilityLabel="De qui voir les paiements ?"
          placeholder="De qui voir les paiements ?"
          _selectedItem={{
            bg: theme.colors.inversePrimary,
            endIcon: <CheckIcon size={7} />,
          }}
          mt={1}
          onValueChange={(itemValue: string) =>
            setPayments(itemValue as "soi" | "tous")
          }
        >
          <Select.Item label={"Vos paiements"} value={"soi"} />
          <Select.Item label={"Tous les paiements"} value={"tous"} />
        </Select>
      )}
      <FlatList
        className="w-full mt-2"
        data={
          payments === "soi"
            ? paiements.filter(
                (paiement: PaiementJoined) => user && paiement.user === user.id
              )
            : paiements
        }
        keyExtractor={(item: PaiementJoined) => item.id as string}
        renderItem={({ item, index }) => <Paiement item={item} />}
      />
    </View>
  );
}
