import {
  ActivityIndicator,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";
import { selectUserById, useGetUsersQuery } from "../users/usersApiSlice";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface PresenceProps {
  item: Presence;
}

export default function Presence({ item }: PresenceProps) {
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
    <View
      className="w-full shadow-black p-2 rounded-lg"
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        elevation: 3,
      }}
    >
      <Title className="text-xl mb-1 font-bold">
        {user.prenom} {user.nom}
      </Title>
      <Paragraph className="text-gray-500 mb-2">
        {new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(item.debut))}
      </Paragraph>
    </View>
  );
}
