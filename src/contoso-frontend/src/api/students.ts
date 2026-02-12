import { apiClient } from './client';
import type { Student, StudentSearchResponse } from '../types/student';

export const studentApi = {
  async getAll(): Promise<Student[]> {
    return apiClient.get('/api/students');
  },

  async searchWithNaturalLanguage(query: string): Promise<StudentSearchResponse> {
    return apiClient.post('/api/search/students', { query });
  },

  async getById(id: number): Promise<Student> {
    return apiClient.get(`/api/students/${id}`);
  },
};
