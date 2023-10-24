import { Paragraph } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { selectArticleById } from "../articles/articlesApiSlice";
import { View } from "react-native";

interface ArticleProps {
  item: string;
}

export default function Article({ item }: ArticleProps) {
  const article: Article | undefined = useSelector((state: RootState) =>
    selectArticleById(state, item)
  ) as Article;

  return (
    <View className="flex flex-row justify-evenly">
      <Paragraph className="text-xl">{article.nom}</Paragraph>
      <Paragraph className="text-xl">{article.prix}</Paragraph>
    </View>
  );
}
