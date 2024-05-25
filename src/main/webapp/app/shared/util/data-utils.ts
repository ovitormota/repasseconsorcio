import { ConsortiumStatusType } from '../model/enumerations/consortium-status-type.model'

// function that returns a boolean checking if an object is empty
export function isNotEmptyObject(obj: any) {
  return !!Object.keys(obj).length
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function addPercentage(value: number, percentage: number | undefined = 0): number {
  if (typeof value !== 'number' || typeof percentage !== 'number') {
    throw new Error('Both value and percentage must be numbers')
  }

  if (!percentage || percentage < 0) {
    if (value < 10000) {
      percentage = 3
    } else if (value < 20000) {
      percentage = 2
    } else {
      percentage = 1
    }
  }

  const newValue: number = value + value * (percentage / 100)

  return Math.round(newValue)
}

export const formatCreated = (value) => {
  const date = new Date(value)
  return date
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' -')
}

export const formatCreatedDate = (value) => {
  const date = new Date(value)
  return date
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
    .replace(',', ' -')
}

export const showElement = (toShow: boolean) => {
  return { display: toShow ? '' : 'none' }
}

export const getStatusColor = (status: ConsortiumStatusType) => {
  switch (status) {
    case 'CLOSED':
      return 'error'
    case 'OPEN':
      return 'success'
    case 'REGISTERED':
      return 'warning'
    case 'WON':
      return 'info'
    default:
      return 'default'
  }
}

export const openPdfViewer = (pdfBase64Content) => {
  if (pdfBase64Content) {
    // Decodificar o conteúdo base64 do PDF
    const byteCharacters = atob(pdfBase64Content)

    // Converter os caracteres para uma array de bytes
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)

    // Criar um blob a partir da array de bytes
    const blob = new Blob([byteArray], { type: 'application/pdf' })

    // Criar uma URL temporária para o blob
    const blobUrl = URL.createObjectURL(blob)

    // Abrir o PDF em uma nova aba
    window.open(blobUrl)
  } else {
    console.error('Nenhum PDF disponível para visualização.')
  }
}
