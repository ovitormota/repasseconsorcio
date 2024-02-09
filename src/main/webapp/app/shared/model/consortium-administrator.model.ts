import { IConsortium } from 'app/shared/model/consortium.model';

export interface IConsortiumAdministrator {
  id?: number;
  name?: string;
  imageContentType?: string | null;
  image?: string | null;
  consortiums?: IConsortium[] | null;
}

export const defaultValue: Readonly<IConsortiumAdministrator> = {};
