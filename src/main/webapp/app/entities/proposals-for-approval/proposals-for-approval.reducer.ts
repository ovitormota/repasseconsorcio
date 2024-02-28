import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import axios from 'axios'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { IConsortium, defaultValue } from 'app/shared/model/consortium.model'
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'

const initialState: EntityState<IConsortium> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
}

const apiUrl = 'api/proposal-approvals'

// Actions

interface IGetEntities extends IQueryParams {
  filterSegmentType?: SegmentType
}

export const getEntities = createAsyncThunk('proposal-approvals/fetch_entity_list', async ({ page, size, sort, filterSegmentType }: IGetEntities) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&filterSegmentType=${filterSegmentType}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IConsortium[]>(requestUrl)
})

export const partialUpdateEntity = createAsyncThunk(
  'proposal-approvals/partial_update_entity',
  async (entity: IConsortium, thunkAPI) => {
    const result = await axios.patch<IConsortium>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(reset())
    thunkAPI.dispatch(
      getEntities({
        page: 0,
        size: 10,
        sort: 'consortiumValue,asc',
        filterSegmentType: SegmentType.ALL,
      })
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const ProposalsForApproval = createEntitySlice({
  name: 'proposal-approvals',
  initialState,
  extraReducers(builder) {
    builder
      .addMatcher(isFulfilled(getEntities), (state, action) => {
        const links = parseHeaderForLinks(action.payload.headers.link)
        return {
          ...state,
          loading: false,
          links,
          entities: loadMoreDataWhenScrolled(state.entities, action.payload.data, links),
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        }
      })
      .addMatcher(isFulfilled(partialUpdateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload.data
      })
      .addMatcher(isPending(getEntities, partialUpdateEntity), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
  },
})

export const { reset } = ProposalsForApproval.actions

// Reducer
export default ProposalsForApproval.reducer
