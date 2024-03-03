import axios from 'axios'
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { cleanEntity } from 'app/shared/util/entity-utils'
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { IConsortium, defaultValue } from 'app/shared/model/consortium.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { getEntities as getEntitiesForApproval } from 'app/entities/proposals-for-approval/proposals-for-approval.reducer'

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

const apiUrl = 'api/consortiums'

// Actions

interface IGetEntities extends IQueryParams {
  filterSegmentType?: SegmentType
}

export const getEntities = createAsyncThunk('consortium/fetch_entity_list', async ({ page, size, sort, filterSegmentType }: IGetEntities) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&filterSegmentType=${filterSegmentType}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IConsortium[]>(requestUrl)
})

export const getEntity = createAsyncThunk(
  'consortium/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IConsortium>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'consortium/create_entity',
  async (entity: IConsortium, thunkAPI) => {
    const result = await axios.post<IConsortium>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(reset())
    thunkAPI.dispatch(
      getEntities({
        page: 0,
        size: 10,
        sort: 'id,asc',
        filterSegmentType: SegmentType.ALL,
      })
    )
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'consortium/update_entity',
  async (entity: IConsortium, thunkAPI) => {
    return axios.put<IConsortium>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'consortium/partial_update_entity',
  async (entity: IConsortium, thunkAPI) => {
    const result = await axios.patch<IConsortium>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(reset())
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'consortium/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    return await axios.delete<IConsortium>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

// slice

export const ConsortiumSlice = createEntitySlice({
  name: 'consortium',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload.data
      })
      .addCase(deleteEntity.fulfilled, (state) => {
        state.updating = false
        state.updateSuccess = true
        state.entity = {}
      })
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
      .addMatcher(isFulfilled(createEntity, updateEntity, partialUpdateEntity), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.entity = action.payload.data
      })
      .addMatcher(isPending(getEntities, getEntity), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(isPending(createEntity, updateEntity, partialUpdateEntity, deleteEntity), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.updating = true
      })
  },
})

export const { reset } = ConsortiumSlice.actions

// Reducer
export default ConsortiumSlice.reducer
