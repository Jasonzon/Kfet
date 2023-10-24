import { View, TouchableOpacity } from "react-native";
import {
  ActivityIndicator,
  Card,
  Icon,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";
import { selectUserById, useGetUsersQuery } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { router } from "expo-router";

interface PaiementProps {
  item: Paiement;
}

export default function Paiement({ item }: PaiementProps) {
  const theme = useTheme();

  const { isLoading } = useGetUsersQuery();

  const user: User | undefined = useSelector((state: RootState) =>
    selectUserById(state, item.user)
  ) as User;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push(`/paiements/${item.id}`)}
      className="w-full mb-2 p-2 rounded-lg"
      style={{
        backgroundColor: !item.validation
          ? theme.colors.inversePrimary
          : theme.colors.outlineVariant,
      }}
    >
      <View className="mb-2 flex flex-row justify-between">
        <Title className="text-xl">{`${user.prenom} ${user.nom.slice(
          0,
          1
        )}.`}</Title>
        {!item.validation && (
          <Icon
            size={24}
            source="timer-sand-empty"
            color={theme.colors.onErrorContainer}
          />
        )}
      </View>
      <View className="flex flex-row justify-between">
        <Paragraph className="text-gray-500 text-xl">{item.montant}€</Paragraph>
        <Paragraph className="text-gray-500 text-xl">
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(item.envoi))}
        </Paragraph>
      </View>
    </TouchableOpacity>
  );
}
