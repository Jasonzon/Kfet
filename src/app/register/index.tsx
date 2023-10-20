import { Link, router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { useAddNewUserMutation } from "../auth/authApiSlice";
import { useState } from "react";
import { Paragraph, Snackbar, TextInput } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setToken } from "../../utils/token";
import { setUser } from "../auth/authSlice";

export default function Register() {
  const [addNewUser, { isLoading }] = useAddNewUserMutation();

  const dispatch = useDispatch();

  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [mail, setMail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbar, setSnackbar] = useState<string | null>(null);

  async function handleAddNewUser() {
    try {
      const { user, token } = await addNewUser({
        nom,
        prenom,
        tel,
        mail,
        password,
      } as User).unwrap();
      await setToken(token);
      dispatch(setUser({ user }));
      router.push("/");
    } catch (error: any) {
      console.error("Erreur, enregistrement non effectué");
      setSnackbar("Erreur, l'enregistrement a échoué");
    }
  }

  const canSave =
    [nom, prenom, tel, mail, password].every(Boolean) &&
    !isLoading &&
    /^\d{10}$/.test(tel) &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);

  return (
    <View className="flex-1 items-center justify-center mt-16">
      <Text className="text-2xl font-bold mb-4">Bienvenue 👋</Text>
      <TextInput
        placeholder="Prenom"
        value={prenom}
        onChangeText={setPrenom}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Mail"
        value={mail}
        onChangeText={setMail}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Tel"
        value={tel}
        onChangeText={setTel}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleAddNewUser}
        disabled={!canSave}
        className={`${
          canSave ? "bg-blue-500" : "bg-gray-400"
        } py-3 px-6 rounded-lg my-4`}
      >
        <Paragraph>Enregistrement</Paragraph>
      </TouchableOpacity>
      <Snackbar
        visible={snackbar !== null}
        onDismiss={() => setSnackbar(null)}
        duration={2000}
      >
        {snackbar}
      </Snackbar>
      <Link className="underline" href="/connect">
        Déjà un compte ? Se connecter
      </Link>
    </View>
  );
}
