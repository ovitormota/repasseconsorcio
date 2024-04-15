import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from '@reduxjs/toolkit'
import axios from 'axios'

import { StatusType } from 'app/shared/model/enumerations/status.model'
import { IUser, defaultValue } from 'app/shared/model/user.model'
import { getAccount, logout } from 'app/shared/reducers/authentication'
import { IQueryParams, serializeAxiosError } from 'app/shared/reducers/reducer.utils'
import { loadMoreDataWhenScrolled, parseHeaderForLinks } from 'react-jhipster'

const initialState = {
  loading: false,
  errorMessage: null,
  users: [] as ReadonlyArray<IUser>,
  authorities: [] as any[],
  user: defaultValue,
  updating: false,
  updateSuccess: false,
  totalItems: 0,
  links: { next: 0 },
  successMessage: null,
}

interface UploadUserData {
  userId: number
  file: File
}

interface IGetUsersAsAdmin extends IQueryParams {
  filterStatusType?: StatusType
}

const apiUrl = 'api/users'
const adminUrl = 'api/admin/users'

// Async Actions

export const getUsers = createAsyncThunk('userManagement/fetch_users', async ({ page, size, sort }: IQueryParams) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`
  return axios.get<IUser[]>(requestUrl)
})

export const getUsersAsAdmin = createAsyncThunk('userManagement/fetch_users_as_admin', async ({ page, size, sort, filterStatusType }: IGetUsersAsAdmin) => {
  const requestUrl = `${adminUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&filterStatusType=${filterStatusType}` : ''}&cacheBuster=${new Date().getTime()}`
  return axios.get<IUser[]>(requestUrl)
})

export const getRoles = createAsyncThunk('userManagement/fetch_roles', async () => {
  return axios.get<any[]>(`api/authorities`)
})

export const getUser = createAsyncThunk(
  'userManagement/fetch_user',
  async (login: string) => {
    const requestUrl = `${apiUrl}/${login}`
    return axios.get<IUser>(requestUrl)
  },
  { serializeError: serializeAxiosError }
)

export const createUser = createAsyncThunk(
  'userManagement/create_user',
  async (user: IUser, thunkAPI) => {
    const result = await axios.post<IUser>(apiUrl, user)
    return result
  },
  { serializeError: serializeAxiosError }
)

export const updateUser = createAsyncThunk(
  'userManagement/update_user',
  async (user: IUser, thunkAPI) => {
    const result = await axios.put<IUser>(apiUrl, user)
    thunkAPI.dispatch(getAccount())
    return result
  },
  { serializeError: serializeAxiosError }
)

export const uploadUserImage = createAsyncThunk('userManagement/upload_user_image', async ({ userId, file }: UploadUserData, thunkAPI) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${apiUrl}/image-upload?userId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    thunkAPI.dispatch(getAccount())
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const deleteUserImage = createAsyncThunk('userManagement/delete_user_image', async (userId: number, thunkAPI) => {
  try {
    const response = await axios.delete(`${apiUrl}/image-delete?userId=${userId}`)
    thunkAPI.dispatch(getAccount())
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})

export const deleteUser = createAsyncThunk(
  'userManagement/delete_user',
  async (login: string, thunkAPI) => {
    const requestUrl = `${apiUrl}/${login}`
    const result = await axios.delete<IUser>(requestUrl)
    thunkAPI.dispatch(logout())

    return result
  },
  { serializeError: serializeAxiosError }
)

export type UserManagementState = Readonly<typeof initialState>

export const UserManagementSlice = createSlice({
  name: 'userManagement',
  initialState: initialState as UserManagementState,
  reducers: {
    reset() {
      return initialState
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getRoles.fulfilled, (state, action) => {
        state.authorities = action.payload.data
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.updating = false
        state.updateSuccess = true
        state.user = defaultValue
      })
      .addMatcher(isFulfilled(getUsers, getUsersAsAdmin), (state, action) => {
        const links = parseHeaderForLinks(action.payload.headers.link)
        const newUsers = action.payload.data?.length ? action.payload.data : []

        return {
          ...state,
          loading: false,
          links,
          users: loadMoreDataWhenScrolled(newUsers, newUsers, links),
          totalItems: parseInt(action.payload.headers['x-total-count'], 10),
        }
      })
      .addMatcher(isFulfilled(createUser, updateUser, uploadUserImage, deleteUserImage), (state, action) => {
        state.updating = false
        state.loading = false
        state.updateSuccess = true
        state.user = action.payload.data
        state.successMessage = 'User has been created successfully'
      })
      .addMatcher(isPending(getUsers, getUsersAsAdmin, getUser), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.loading = true
      })
      .addMatcher(isPending(createUser, updateUser, deleteUser, uploadUserImage, deleteUserImage), (state) => {
        state.errorMessage = null
        state.updateSuccess = false
        state.updating = true
        state.loading = true
      })
      .addMatcher(isRejected(getUsers, getUsersAsAdmin, getUser, getRoles, createUser, updateUser, deleteUser, uploadUserImage, deleteUserImage), (state, action) => {
        state.loading = false
        state.updating = false
        state.updateSuccess = false
        state.errorMessage = action.error.message
      })
  },
})

export const { reset } = UserManagementSlice.actions

// Reducer
export default UserManagementSlice.reducer
