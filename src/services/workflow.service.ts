import axios from 'axios';

const API_URL = 'http://localhost:5001/api/workflows';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export interface WorkflowData {
  _id?: string;
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    text: string;
  }>;
  lastEditedBy?: {
    name: string;
    email: string;
  };
  updatedAt?: string;
  createdAt?: string;
}

export const workflowService = {
  create: async (data: Omit<WorkflowData, '_id'>) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get<WorkflowData[]>(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  getById: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.get<WorkflowData>(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  update: async (id: string, data: Omit<WorkflowData, '_id'>) => {
    const token = localStorage.getItem('token');
    const response = await axios.put<WorkflowData>(`${API_URL}/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  delete: async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
