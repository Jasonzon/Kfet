import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { PaperProvider } from "react-native-paper";

export default function AppLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </Provider>
  );
}
