import { IUtilisateur } from 'app/entities/utilisateur/utilisateur.model';

export interface IExtraUser {
  id?: number;
  role?: string | null;
  utilisateur?: IUtilisateur | null;
}

export class ExtraUser implements IExtraUser {
  constructor(public id?: number, public role?: string | null, public utilisateur?: IUtilisateur | null) {}
}

export function getExtraUserIdentifier(extraUser: IExtraUser): number | undefined {
  return extraUser.id;
}
