import { IConsortium } from 'app/shared/model/consortium.model'
import { StatusConsortiumInstallments } from './enumerations/status-consortium-installments'

export interface IConsortiumInstallments {
  id?: number
  numberOfInstallments?: number | null
  installmentValue?: number | null
  consortium?: IConsortium | null
  status?: StatusConsortiumInstallments | null
  installmentDate?: string | null
}

export const defaultValue: Readonly<IConsortiumInstallments> = {}
