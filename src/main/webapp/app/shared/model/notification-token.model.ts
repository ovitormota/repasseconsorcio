import { IUser } from 'app/shared/model/user.model'

export interface INotificationToken {
  id?: number
  token?: string | null
  user?: IUser | null
}

export const defaultValue: Readonly<INotificationToken> = {}
