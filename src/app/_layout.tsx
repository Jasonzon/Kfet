import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { PaperProvider } from "react-native-paper";
import { NativeBaseProvider } from "native-base";

export default function AppLayout() {
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <PaperProvider>
          <Slot />
        </PaperProvider>
      </Provider>
    </NativeBaseProvider>
  );
}
