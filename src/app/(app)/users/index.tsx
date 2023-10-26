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
  const { isLoading: isLoadingUsers } = useGetUsersQuery();

  const user: User | null = useSelector(selectCurrentUser);

  const users: User[] = useSelector((state: RootState) =>
    selectAllUsers(state)
  );

  const theme = useTheme();

  const [search, setSearch] = useState<string>("");

  if (isLoadingUsers) {
    return (
      <View className="flex-1 items-center justify-center ">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 mt-4">
      <Title className="text-3xl mb-2 font-bold">Utilisateurs</Title>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Rechercher"
        className="bg-white border rounded-md px-4 py-0.5 mb-3 w-80"
      />
      <FlatList
        data={users.filter(
          (user: User) =>
            user.nom.toLowerCase().includes(search.toLowerCase()) ||
            user.prenom.toLowerCase().includes(search.toLowerCase())
        )}
        numColumns={2}
        keyExtractor={(item: User) => item.id as string}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-full p-2 rounded-lg"
            style={{
              backgroundColor:
                user?.id !== item.id
                  ? theme.colors.inverseOnSurface
                  : theme.colors.inversePrimary,
            }}
            onPress={() => router.push(`/users/${item.id}`)}
          >
            <Title className="text-xl font-bold">{`${
              item.prenom
            } ${item.nom[0].toUpperCase()}.`}</Title>
            <Paragraph className="text-gray-500 mt-2">{item.tel}</Paragraph>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
