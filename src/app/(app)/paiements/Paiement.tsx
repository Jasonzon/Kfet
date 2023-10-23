import { Card, Paragraph, Title } from "react-native-paper";

interface PaiementProps {
  item: Paiement;
}

export default function Paiement({ item }: PaiementProps) {
  return (
    <Card className="my-4">
      <Card.Content>
        <Title className="text-xl mb-2">{`${
          item.user.prenom
        } ${item.user.nom.slice(0, 1)}.`}</Title>
        <Paragraph className="text-gray-500 mb-2">{item.montant}</Paragraph>
      </Card.Content>
    </Card>
  );
}
