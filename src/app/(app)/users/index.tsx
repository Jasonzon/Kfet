import { useSelector } from "react-redux";
import { selectAllUsers, useGetUsersQuery } from "./usersApiSlice";
import { RootState } from "../../store";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  Title,
  Paragraph,
  useTheme,
  ActivityIndicator,
  TextInput,
} from "react-native-paper";
import { selectCurrentUser } from "../../auth/authSlice";
import { router } from "expo-router";
import { useState } from "react";

export default function Admin() {
  const { isLoading } = useGetUsersQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const users: User[] = useSelector((state: RootState) =>
    selectAllUsers(state)
  );

  const theme = useTheme();

  const [search, setSearch] = useState<string>("");

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Title className="text-3xl mb-2">Tous les utilisateurs</Title>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Rechercher"
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <FlatList
        data={users.filter(
          (user: User) =>
            user.nom.includes(search) || user.prenom.includes(search)
        )}
        numColumns={2}
        keyExtractor={(item: User) => item.id as string}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-full m-2 p-2 rounded-lg"
            style={{
              backgroundColor:
                user?.id !== item.id
                  ? theme.colors.inverseOnSurface
                  : theme.colors.inversePrimary,
            }}
            onPress={() => router.push(`/users/${item.id}`)}
          >
            <Title className="text-xl mb-1">{`${
              item.prenom
            } ${item.nom[0].toUpperCase()}.`}</Title>
            <Paragraph className="text-gray-500 mb-1">{item.tel}</Paragraph>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
