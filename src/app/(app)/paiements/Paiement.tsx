import { Card, Paragraph, Title } from "react-native-paper";

interface PaiementProps {
  item: PaiementJoined;
}

export default function Paiement({ item }: PaiementProps) {
  return (
    <Card className="w-full mb-2">
      <Card.Content>
        <Title className="text-xl mb-2">{`${item.prenom} ${item.nom.slice(
          0,
          1
        )}.`}</Title>
        <Paragraph className="text-gray-500 text-xl">{item.montant}€</Paragraph>
      </Card.Content>
    </Card>
  );
}
