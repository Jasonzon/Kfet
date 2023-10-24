import { Card, Icon, Paragraph, Title, useTheme } from "react-native-paper";
import { Image, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
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
    <View className="relative pb-8">
      <TouchableOpacity
        className="m-2 w-40 p-2 rounded-lg"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
        onPress={() => {
          dispatch(
            setArticle({ article: { ...item, prix: item.prix.toString() } })
          );
          router.push(`/articles/${item.id}`);
        }}
      >
        <Title className="text-xl mb-1">{item.nom}</Title>
        <Paragraph className="text-gray-500 mb-1">{item.prix}€</Paragraph>
        <View className="flex justify-center items-center">
          <Image
            source={{ uri: item.image }}
            style={{ width: 100, height: 100, resizeMode: "cover" }}
            className="m-2 rounded-lg"
          />
        </View>
      </TouchableOpacity>
      <View className="flex flex-1 flex-row justify-evenly absolute w-full bottom-1">
        <TouchableOpacity
          className="rounded-md bg-white"
          onPress={() => dispatch(removeFromCart({ articleId: item.id! }))}
        >
          <Icon source="minus" size={30} />
        </TouchableOpacity>
        <Paragraph className="translate-y-0.5">{number}</Paragraph>
        <TouchableOpacity
          className="rounded-md bg-white"
          onPress={() => dispatch(addToCart({ article: item }))}
        >
          <Icon source="plus" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
