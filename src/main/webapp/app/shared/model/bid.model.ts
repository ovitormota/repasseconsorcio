import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { IConsortium } from 'app/shared/model/consortium.model';

export interface IBid {
  id?: number;
  value?: number | null;
  created?: string | null;
  user?: IUser | null;
  consortium?: IConsortium | null;
}

export const defaultValue: Readonly<IBid> = {};
