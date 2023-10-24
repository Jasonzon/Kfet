import { Card, Icon, Paragraph, Title, useTheme } from "react-native-paper";
import { Image, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectArticleNumber, addToCart, removeFromCart } from "./cartSlice";
import { router } from "expo-router";
import { setArticle } from "./articleFormSlice";

interface ArticleProps {
  item: Article;
}

export default function Article({ item }: ArticleProps) {
  const dispatch = useDispatch();

  const number = useSelector((state: RootState) =>
    selectArticleNumber(state, item.id!)
  );

  const theme = useTheme();

  return (
    <Card
      className="m-2 w-40"
      onPress={() => {
        dispatch(
          setArticle({ article: { ...item, prix: item.prix.toString() } })
        );
        router.push(`/articles/${item.id}`);
      }}
    >
      <Card.Content>
        <Title className="text-xl mb-1">{item.nom}</Title>
        <Paragraph className="text-gray-500 mb-1">{item.prix}€</Paragraph>
        <Image
          source={{ uri: item.image }}
          style={{ width: 100, height: 100, resizeMode: "cover" }}
          className="m-2"
        />
        <View className="flex flex-row gap-4">
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.inversePrimary }}
            className="rounded-md"
            onPress={() => dispatch(removeFromCart({ articleId: item.id! }))}
          >
            <Icon source="minus" size={24} />
          </TouchableOpacity>
          <Paragraph
            style={{ color: theme.colors.primary }}
            className="translate-y-0.5"
          >
            {number}
          </Paragraph>
          <TouchableOpacity
            style={{ backgroundColor: theme.colors.inversePrimary }}
            className="rounded-md"
            onPress={() => dispatch(addToCart({ article: item }))}
          >
            <Icon source="plus" size={24} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
}
