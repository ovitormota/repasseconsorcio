import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { uploadUserImage } from 'app/modules/administration/user-management/user-management.reducer'
import { serializeAxiosError } from 'app/shared/reducers/reducer.utils'

const initialState = {
  loading: false,
  registrationSuccess: false,
  registrationFailure: false,
  errorMessage: null,
  successMessage: null,
  dataError: null,
}

export type RegisterState = Readonly<typeof initialState>

// Actions

interface IHandleRegister {
  data: {
    firstName: string
    lastName: string
    login: string
    email: string
    password: string
    langKey?: string
  }
  file: File
}

export const handleRegister = createAsyncThunk(
  'register/create_account',
  async ({ data, file }: IHandleRegister, thunkAPI) =>
    axios.post<any>('api/register', data).then((response) => {
      if (response.status === 201 && file && response.data.id) {
        thunkAPI.dispatch(uploadUserImage({ userId: response.data.id, file }))
      }
    }),
  { serializeError: serializeAxiosError }
)

export const RegisterSlice = createSlice({
  name: 'register',
  initialState: initialState as RegisterState,
  reducers: {
    reset() {
      return initialState
    },
  },
  extraReducers(builder) {
    builder
      .addCase(handleRegister.pending, (state) => {
        state.loading = true
      })
      .addCase(handleRegister.rejected, (state, action) => ({
        ...initialState,
        registrationFailure: true,
        errorMessage: action.error.name,
        dataError: action,
      }))
      .addCase(handleRegister.fulfilled, () => ({
        ...initialState,
        registrationSuccess: true,
        successMessage: 'register.messages.success',
      }))
  },
})

export const { reset } = RegisterSlice.actions

// Reducer
export default RegisterSlice.reducer
