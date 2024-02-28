import { translate } from 'react-jhipster'
import { isFulfilledAction, isRejectedAction } from 'app/shared/reducers/reducer.utils'
import toast from 'react-hot-toast'

interface ErrorData {
  fieldErrors?: { field: string; objectName: string; message: string }[]
  message?: string
  error?: string
  title?: string
  detail?: string
}

const addErrorAlert = (message: any, key?: any, data?: any): void => {
  key = key || message
  toast.error(translate(key, data))
}

const handleFulfilledAction = (action: any): void => {
  const { payload } = action
  if (payload && payload.headers) {
    const { headers } = payload
    let alert: string | null = null
    let alertParams: string | null = null

    headers &&
      Object.entries<string>(headers).forEach(([k, v]) => {
        const keyLower = k.toLowerCase()
        if (keyLower.endsWith('app-alert')) {
          alert = v
        } else if (keyLower.endsWith('app-params')) {
          alertParams = decodeURIComponent(v.replace(/\+/g, ' '))
        }
      })

    if (alert) {
      const alertParam = alertParams
      toast.success(translate(alert, { param: alertParam }))
    }
  }
}

const handleBadRequestError = (data: ErrorData | undefined, headers: Record<string, string> | undefined): void => {
  let errorHeader: string | null = null
  let entityKey: string | null = null

  headers &&
    Object.entries<string>(headers).forEach(([k, v]) => {
      const keyLower = k.toLowerCase()
      if (keyLower.endsWith('app-error')) {
        errorHeader = v
      } else if (keyLower.endsWith('app-params')) {
        entityKey = v
      }
    })

  if (errorHeader) {
    const entityName = translate(`global.menu.entities.${entityKey}`)
    addErrorAlert(errorHeader, errorHeader, { entityName })
  } else if (data?.fieldErrors) {
    handleFieldErrors(data.fieldErrors)
  } else if (typeof data === 'string' && data !== '') {
    addErrorAlert(data)
  } else {
    toast.error(data?.message || data?.error || data?.title || 'Unknown error!')
  }
}

const handleFieldErrors = (fieldErrors: { field: string; objectName: string; message: string }[]): void => {
  for (const fieldError of fieldErrors) {
    if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
      fieldError.message = 'Size'
    }
    const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]')
    const fieldName = translate(`fleetSenseApp.${fieldError.objectName}.${convertedField}`)
    addErrorAlert(`Error on field "${fieldName}"`, `error.${fieldError.message}`, { fieldName })
  }
}

const handleDefaultError = (data: ErrorData | undefined): void => {
  if (typeof data === 'string' && data !== '') {
    addErrorAlert(data)
  } else {
    toast.error(data?.detail || data?.message || data?.title || 'Unknown error!')
  }
}

const handleAxiosError = (error: any): void => {
  const { response, config } = error
  const { data, status, headers } = response

  if (!(status === 401 && (error.message === '' || (data && data.path && (data.path.includes('/api/account') || data.path.includes('/api/authenticate')))))) {
    switch (status) {
      case 0:
        addErrorAlert('Server not reachable', 'error.server.not.reachable')
        break

      case 400:
        handleBadRequestError(data, headers)
        break

      case 404:
        addErrorAlert('Not found', 'error.url.not.found')
        break

      case 500:
        addErrorAlert('An unexpected error occurred', 'error.http.500')
        break

      default:
        handleDefaultError(data)
    }
  } else if (config && config.url === 'api/account' && config.method === 'get') {
    console.log('Authentication Error: Trying to access url api/account with GET.')
  } else {
    toast.error(error.message || 'Unknown error!')
  }
}

const handleRejectedAction = (action: any): void => {
  const { error } = action
  if (error && error.isAxiosError) {
    if (error.response) {
      handleAxiosError(error)
    } else if (error.config && error.config.url === 'api/account' && error.config.method === 'get') {
      console.log('Authentication Error: Trying to access url api/account with GET.')
    } else {
      toast.error(error.message || 'Unknown error!')
    }
  } else if (error) {
    toast.error(error.message || 'Unknown error!')
  }
}

export default () =>
  (next: any) =>
  (action: any): any => {
    if (isFulfilledAction(action)) {
      handleFulfilledAction(action)
    } else if (isRejectedAction(action)) {
      handleRejectedAction(action)
    }

    return next(action)
  }
