import dayjs from 'dayjs'
import { IBid } from 'app/shared/model/bid.model'
import { IConsortiumInstallments } from 'app/shared/model/consortium-installments.model'
import { IUser } from 'app/shared/model/user.model'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'

export interface IConsortium {
  id?: number
  consortiumValue?: number | null
  created?: string | null
  minimumBidValue?: number | null
  segmentType?: SegmentType | null
  status?: ConsortiumStatusType | null
  bids?: IBid[] | null
  consortiumInstallments?: IConsortiumInstallments[] | null
  user?: IUser | null
  consortiumAdministrator?: IConsortiumAdministrator | null
  contemplationStatus?: boolean | null
}

export const defaultValue: Readonly<IConsortium> = {}
