// function that returns a boolean checking if an object is empty
export function isEmptyObject(obj: any) {
  return !!Object.keys(obj).length
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatCreated = (value) => {
  const date = new Date(value)
  return date
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' -')
}
