import { IconButton, Paragraph, Title, useTheme } from "react-native-paper";
import { Image, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, selectCart } from "./cartSlice";
import { router } from "expo-router";
import { setArticle } from "./articleFormSlice";

interface ArticleProps {
  item: Article;
}

export default function Article({ item }: ArticleProps) {
  const dispatch = useDispatch();

  const cart = useSelector(selectCart);

  const number = cart.filter(
    (article: Article) => article.id === item.id
  ).length;

  const theme = useTheme();

  return (
    <View className="relative pb-10">
      <TouchableOpacity
        className="m-2 w-40 p-2 rounded-lg shadow-black"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          elevation: 3,
        }}
        onPress={() => {
          dispatch(
            setArticle({ article: { ...item, prix: item.prix.toString() } })
          );
          router.push(`/articles/${item.id}`);
        }}
      >
        <Title className="text-xl font-bold ml-2">{item.nom}</Title>
        <Paragraph className="text-gray-500 mb-1 text-lg ml-2">
          {item.prix}€
        </Paragraph>
        <View className="flex justify-center items-center">
          <Image
            source={{ uri: item.image }}
            style={{ width: 130, height: 130, resizeMode: "cover" }}
            className="m-1 rounded-lg"
          />
        </View>
      </TouchableOpacity>
      <View className="flex flex-1 flex-row justify-evenly absolute w-full -bottom-1">
        <IconButton
          size={30}
          icon="minus"
          onPress={() => dispatch(removeFromCart({ articleId: item.id! }))}
        />
        <Paragraph className="translate-y-3 font-bold text-xl">
          {number}
        </Paragraph>
        <IconButton
          icon="plus"
          size={30}
          onPress={() => dispatch(addToCart({ article: item }))}
        />
      </View>
    </View>
  );
}
