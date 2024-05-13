import axios from 'axios'
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

import { cleanEntity } from 'app/shared/util/entity-utils'
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { IConsortiumInstallments, defaultValue } from 'app/shared/model/consortium-installments.model'

const initialState: EntityState<IConsortiumInstallments> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  links: { next: 0 },
  updating: false,
  totalItems: 0,
  updateSuccess: false,
}

const apiUrl = 'api/consortium-installments'

// Actions

export const getEntities = createAsyncThunk('consortiumInstallments/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<IConsortiumInstallments[]>(requestUrl)
})

export const getEntity = createAsyncThunk(
  'consortiumInstallments/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<IConsortiumInstallments>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'consortiumInstallments/create_entity',
  async (entity: IConsortiumInstallments, thunkAPI) => {
    return axios.post<IConsortiumInstallments>(apiUrl, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'consortiumInstallments/update_entity',
  async (entity: IConsortiumInstallments, thunkAPI) => {
    return axios.put<IConsortiumInstallments>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'consortiumInstallments/partial_update_entity',
  async (entity: IConsortiumInstallments, thunkAPI) => {
    return axios.patch<IConsortiumInstallments>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'consortiumInstallments/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    return await axios.delete<IConsortiumInstallments>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

// slice

export const ConsortiumInstallmentsSlice = createEntitySlice({
  name: 'consortiumInstallments',
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

export const { reset } = ConsortiumInstallmentsSlice.actions

// Reducer
export default ConsortiumInstallmentsSlice.reducer
