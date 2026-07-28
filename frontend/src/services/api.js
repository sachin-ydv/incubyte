const API_BASE_URL = '/api';

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API services
export const authService = {
  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password, role = 'user') =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  getMe: () => apiRequest('/auth/me'),
};

// Vehicle API services
export const vehicleService = {
  getAll: () => apiRequest('/vehicles'),

  getById: (id) => apiRequest(`/vehicles/${id}`),

  search: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/vehicles/search?${query}`);
  },

  create: (vehicleData) =>
    apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    }),

  update: (id, vehicleData) =>
    apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    }),

  delete: (id) =>
    apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    }),

  purchase: (id) =>
    apiRequest(`/vehicles/${id}/purchase`, {
      method: 'POST',
    }),

  restock: (id, amount) =>
    apiRequest(`/vehicles/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }),
};
