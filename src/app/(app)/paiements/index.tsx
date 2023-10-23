import { useSelector } from "react-redux";
import { selectAllPaiements, useGetPaiementsQuery } from "./paiementsApiSlice";
import { RootState } from "../../store";
import { Title, ActivityIndicator } from "react-native-paper";
import { View, FlatList } from "react-native";
import { selectCurrentUser } from "../../auth/authSlice";
import Paiement from "./Paiement";
import { Select, CheckIcon } from "native-base";
import { useState } from "react";

export default function Paiements() {
  const { isLoading } = useGetPaiementsQuery();

  const paiements: Paiement[] = useSelector((state: RootState) =>
    selectAllPaiements(state)
  );

  const user: User | null = useSelector(selectCurrentUser);

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
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />,
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
        data={
          payments === "soi"
            ? paiements.filter(
                (paiement: Paiement) => user && paiement.user.id === user.id
              )
            : paiements
        }
        keyExtractor={(item: Paiement) => item.id as string}
        renderItem={({ item }) => <Paiement item={item} />}
      />
    </View>
  );
}
