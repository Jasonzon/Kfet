type User = {
  prenom: string;
  nom: string;
  mail: string;
  tel: string;
};

type Registering = User & {
  password: string;
};
