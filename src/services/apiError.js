export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data
  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.message || e).join(', ')
  }
  if (error?.message) return error.message
  return fallback
}

export function unwrapApiData(response) {
  return response?.data?.data ?? response?.data
}
