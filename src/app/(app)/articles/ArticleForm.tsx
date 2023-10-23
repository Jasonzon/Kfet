import { TextInput } from "react-native-paper";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  selectArticle,
  updateImage,
  updateNom,
  updatePrix,
} from "./articleFormSlice";

export default function ArticleForm() {
  const { nom, prix, image } = useSelector(selectArticle);

  const dispatch = useDispatch();

  return (
    <View className="p-4 mt-8 flex-1 items-center justify-center">
      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={(text) => dispatch(updateNom({ nom: text }))}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="Prix"
        keyboardType="numeric"
        value={prix?.toString()}
        onChangeText={(text) => dispatch(updatePrix({ prix: Number(text) }))}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
      <TextInput
        placeholder="URL de l'image"
        value={image}
        onChangeText={(text) => dispatch(updateImage({ image: text }))}
        className="bg-white border rounded-md px-4 py-2 mb-4 w-80"
      />
    </View>
  );
}
