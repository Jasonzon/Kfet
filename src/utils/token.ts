import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  try {
    const value = await AsyncStorage.getItem("token");
    return value;
  } catch (err: any) {
    console.error("Erreur", err.message);
  }
}

export async function setToken(token: string) {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (err: any) {
    console.error(err.message);
  }
}
