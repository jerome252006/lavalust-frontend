const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'The request failed.')
  }
  return payload
}

export const login = (username, password) =>
  request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })

export const logout = () =>
  request('/api/logout', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') || '' }),
  })

export const getProducts = () => request('/api/products')

export const createProduct = (product) =>
  request('/api/products', { method: 'POST', body: JSON.stringify(product) })

export const updateProduct = (id, product) =>
  request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) })

export const deleteProduct = (id) =>
  request(`/api/products/${id}`, { method: 'DELETE' })
