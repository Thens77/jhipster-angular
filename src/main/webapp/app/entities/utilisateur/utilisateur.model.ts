export interface IUtilisateur {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  photo?: string | null;
  password?: string | null;
  email?: string | null;
}

export class Utilisateur implements IUtilisateur {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public photo?: string | null,
    public password?: string | null,
    public email?: string | null
  ) {}
}

export function getUtilisateurIdentifier(utilisateur: IUtilisateur): number | undefined {
  return utilisateur.id;
}
