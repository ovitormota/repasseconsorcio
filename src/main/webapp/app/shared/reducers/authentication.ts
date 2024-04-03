import axios, { AxiosResponse } from 'axios'
import { Storage } from 'react-jhipster'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { serializeAxiosError } from './reducer.utils'

import { AppThunk } from 'app/config/store'
import { setLocale } from 'app/shared/reducers/locale'
import toast from 'react-hot-toast'
import { getMessaging, getToken } from 'firebase/messaging'
import { messaging } from 'app/FirebaseConfig'
import { icon } from '@fortawesome/fontawesome-svg-core'

const AUTH_TOKEN_KEY = 'app-authenticationToken'

export const initialState = {
  loading: false,
  isAuthenticated: false,
  loginSuccess: false,
  loginError: false, // Errors returned from server side
  showModalLogin: false,
  account: {} as any,
  errorMessage: null as any, // Errors returned from server side
  redirectMessage: null as unknown as string,
  sessionHasBeenFetched: false,
  logoutUrl: null as unknown as string,
}

export type AuthenticationState = Readonly<typeof initialState>

// Actions

export const getSession = (): AppThunk => async (dispatch, getState) => {
  await dispatch(getAccount())

  const { account } = getState().authentication
  if (account && account.langKey) {
    const langKey = Storage.local.get('locale', account.langKey)
    dispatch(setLocale(langKey))
  }
}

export const getAccount = createAsyncThunk('authentication/get_account', async () => axios.get<any>('api/account'), {
  serializeError: serializeAxiosError,
})

interface IAuthParams {
  username: string
  password: string
  rememberMe?: boolean
}

export const authenticate = createAsyncThunk('authentication/login', async (auth: IAuthParams) => axios.post<any>('api/authenticate', auth), {
  serializeError: serializeAxiosError,
})

export const login: (username: string, password: string, rememberMe?: boolean) => AppThunk =
  (username, password, rememberMe = false) =>
  async (dispatch) => {
    const result = await dispatch(authenticate({ username, password, rememberMe }))
    const response = result.payload as AxiosResponse
    const bearerToken = response?.headers?.authorization
    if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
      const jwt = bearerToken.slice(7, bearerToken.length)
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, jwt)
      } else {
        Storage.local.set(AUTH_TOKEN_KEY, jwt)
      }
    }
    dispatch(getSession())
    await saveUserFCMToken()
  }

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY)
  }
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY)
  }
}

export const logout: () => AppThunk = () => async (dispatch) => {
  await deleteUserFCMToken()
  clearAuthToken()
  dispatch(logoutSession())
}

export const clearAuthentication = (messageKey) => (dispatch) => {
  clearAuthToken()
  dispatch(authError(messageKey))
  dispatch(clearAuth())
}

export const requestPermission = async () => {
  const permission = await Notification.requestPermission()
  if (permission === 'denied') {
    // toast('Ativando as notificações, você receberá alertas sobre novas mensagens e atualizações.')

    await Notification.requestPermission()

    return
  }
}

const saveUserFCMToken = async () => {
  try {
    requestPermission()

    if (messaging) {
      const newSw = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      const FCMToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, serviceWorkerRegistration: newSw })

      if (FCMToken) {
        // Salva o token FCM no servidor
        await axios.post('api/notification-tokens', {
          token: FCMToken,
        })
        console.log('Token salvo com sucesso.')
      } else {
        console.log('Não foi possível obter o token FCM.')
      }
    }
  } catch (error) {
    console.log('Erro ao salvar o token:', error)
  }
}

const deleteUserFCMToken = async () => {
  try {
    requestPermission()

    if (messaging) {
      const newSw = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      const FCMToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY, serviceWorkerRegistration: newSw })

      if (FCMToken) {
        // Deleta o token FCM no servidor
        await axios.delete(`api/notification-tokens/${FCMToken}`)
        console.log('Token deletado com sucesso.')
      } else {
        console.log('Não foi possível obter o token FCM.')
      }
    }
  } catch (error) {
    console.log('Erro ao deletar o token:', error)
  }
}

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState: initialState as AuthenticationState,
  reducers: {
    logoutSession() {
      return {
        ...initialState,
        showModalLogin: true,
      }
    },
    authError(state, action) {
      return {
        ...state,
        showModalLogin: true,
        redirectMessage: action.payload,
        errorMessage: action,
      }
    },
    clearAuth(state) {
      return {
        ...state,
        loading: false,
        showModalLogin: true,
        isAuthenticated: false,
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(authenticate.rejected, (state, action) => ({
        ...initialState,
        errorMessage: action,
        showModalLogin: true,
        loginError: true,
      }))
      .addCase(authenticate.fulfilled, (state) => ({
        ...state,
        loading: false,
        loginError: false,
        showModalLogin: false,
        loginSuccess: true,
      }))
      .addCase(getAccount.rejected, (state, action) => ({
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        showModalLogin: true,
        errorMessage: action,
      }))
      .addCase(getAccount.fulfilled, (state, action) => {
        const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated
        return {
          ...state,
          isAuthenticated,
          loading: false,
          sessionHasBeenFetched: true,
          account: action.payload.data,
        }
      })
      .addCase(authenticate.pending, (state) => {
        state.loading = true
      })
      .addCase(getAccount.pending, (state) => {
        state.loading = true
      })
  },
})

export const { logoutSession, authError, clearAuth } = AuthenticationSlice.actions

// Reducer
export default AuthenticationSlice.reducer
