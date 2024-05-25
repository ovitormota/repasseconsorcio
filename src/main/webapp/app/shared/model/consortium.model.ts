import { IBid } from 'app/shared/model/bid.model'
import { IConsortiumInstallments } from 'app/shared/model/consortium-installments.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { IUser } from 'app/shared/model/user.model'
import { SegmentType } from './enumerations/segment-type.model'

export interface IConsortium {
  id?: number
  user?: IUser | null
  note?: string | null
  bids?: IBid[] | null
  created?: string | null
  amountsPaid?: number | null
  minimumBidValue?: number | null
  consortiumValue?: number | null
  consortiumExtract?: string | null
  editedConsortiumExtract?: string | null
  status?: ConsortiumStatusType | null
  contemplationStatus?: boolean | null
  consortiumInstallments?: IConsortiumInstallments[] | null
  segmentType?: SegmentType | null
}

export const defaultValue: Readonly<IConsortium> = {}
