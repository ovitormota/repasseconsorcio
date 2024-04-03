import axios from 'axios'
import { createAsyncThunk, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'

import { cleanEntity } from 'app/shared/util/entity-utils'
import { IQueryParams, createEntitySlice, EntityState, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { INotificationToken, defaultValue } from 'app/shared/model/notification-token.model'

const initialState: EntityState<INotificationToken> = {
  loading: false,
  errorMessage: null,
  entities: [],
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
}

const apiUrl = 'api/notification-tokens'

// Actions

export const getEntities = createAsyncThunk('notificationToken/fetch_entity_list', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&` : '?'}cacheBuster=${new Date().getTime()}`
  return axios.get<INotificationToken[]>(requestUrl)
})

export const getEntity = createAsyncThunk(
  'notificationToken/fetch_entity',
  async (id: string | number) => {
    const requestUrl = `${apiUrl}/${id}`
    return axios.get<INotificationToken>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createEntity = createAsyncThunk(
  'notificationToken/create_entity',
  async (entity: INotificationToken, thunkAPI) => {
    const result = await axios.post<INotificationToken>(apiUrl, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateEntity = createAsyncThunk(
  'notificationToken/update_entity',
  async (entity: INotificationToken, thunkAPI) => {
    const result = await axios.put<INotificationToken>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const partialUpdateEntity = createAsyncThunk(
  'notificationToken/partial_update_entity',
  async (entity: INotificationToken, thunkAPI) => {
    const result = await axios.patch<INotificationToken>(`${apiUrl}/${entity.id}`, cleanEntity(entity))
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

export const deleteEntity = createAsyncThunk(
  'notificationToken/delete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}`
    const result = await axios.delete<INotificationToken>(requestUrl)
    thunkAPI.dispatch(getEntities({}))
    return result
  },
  { serializeError: serializeAxiosError }
)

// slice

export const NotificationTokenSlice = createEntitySlice({
  name: 'notificationToken',
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
        return {
          ...state,
          loading: false,
          entities: action.payload.data,
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

export const { reset } = NotificationTokenSlice.actions

// Reducer
export default NotificationTokenSlice.reducer
