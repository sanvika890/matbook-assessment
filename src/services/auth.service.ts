import axios from 'axios';

const API_URL = import.meta.env.MODE === 'production' 
  ? `${import.meta.env.VITE_API_URL}/api/auth`  
  : 'http://localhost:5001/api/auth';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};

export const getProfile = async (token: string): Promise<any> => {
  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const signout = () => {
  localStorage.removeItem('token');
};
