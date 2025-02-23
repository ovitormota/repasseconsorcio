import { createAsyncThunk, isFulfilled, isPending } from '@reduxjs/toolkit'
import axios from 'axios'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { IBid, defaultValue } from 'app/shared/model/bid.model'
import { EntityState, IQueryParams, createEntitySlice, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { cleanEntity } from 'app/shared/util/entity-utils'
import { getEntitiesByConsortium, reset as resetBid } from './bid-by-consortium.reducer'

const initialState: EntityState<IBid> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  value: null,
}

const apiUrl = 'api/bids'

// Actions

export const getEntities = createAsyncThunk('bid/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IBid[]>(requestUrl)
})

export const getEntity = createAsyncThunk(
  'bid/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IBid>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const getLatestEntity = createAsyncThunk('bid/fetch_latest_entity', async (consortiumId: string | number) => {
  const requestUrl = `${apiUrl}/latest/${consortiumId}`
  return axios.get<number | null>(requestUrl)
})

export const createEntity = createAsyncThunk(
  'bid/create_entity',
  async (entity: IBid) => {
    const result = await axios.post<IBid>(apiUrl, cleanEntity(entity))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'bid/update_entity',
  async (entity: IBid, thunkAPI) => {
    return axios.put<IBid>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'bid/partial_update_entity',
  async (entity: IBid, thunkAPI) => {
    return axios.patch<IBid>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'bid/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    return await axios.delete<IBid>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

// slice

export const BidSlice = createEntitySlice({
  name: 'bid',
  initialState,
  extraReducers(builder) {
    builder
      .addCase(getEntity.fulfilled, (state, action) => {
        state.loading = false
        state.entity = action.payload.data
      })
      .addCase(getLatestEntity.fulfilled, (state, action) => {
        state.loading = false
        state.value = action.payload.data
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
      .addMatcher(isPending(getEntities, getEntity, getLatestEntity), (state) => {
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

export const { reset } = BidSlice.actions

// Reducer
export default BidSlice.reducer
