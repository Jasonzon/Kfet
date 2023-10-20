import { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useLoginMutation } from "../auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setUser } from "../auth/authSlice";
import { Link, router } from "expo-router";
import { setToken } from "../../utils/token";
import { Paragraph, Snackbar, TextInput } from "react-native-paper";

export default function Connect() {
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbar, setSnackbar] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  async function onLogin() {
    try {
      const { user, token } = await login({
        mail,
        password,
      }).unwrap();
      await setToken(token);
      dispatch(setUser({ user }));
      router.push("/home");
    } catch (err: any) {
      console.error("Error", err.message);
      setSnackbar("Erreur, la connexion a échoué");
    }
  }

  const canSave = [mail, password].every(Boolean) && !isLoading;

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">Salut 👋</Text>
      <TextInput
        value={mail}
        onChangeText={setMail}
        placeholder="Mail"
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mot de passe"
        secureTextEntry
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TouchableOpacity
        onPress={onLogin}
        disabled={!canSave}
        className={`${
          canSave ? "bg-blue-500" : "bg-gray-400"
        } py-3 px-6 rounded-lg my-4`}
      >
        <Paragraph>Connexion</Paragraph>
      </TouchableOpacity>
      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => setSnackbar(null)}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
      <Link className="underline" href="/register">
        Pas de compte ? S'enregistrer
      </Link>
    </View>
  );
}
