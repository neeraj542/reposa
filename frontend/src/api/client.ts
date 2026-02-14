import axios from 'axios';
import type { Analysis } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
    analyzeRepository: async (repoUrl: string): Promise<Analysis> => {
        const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
            repo_url: repoUrl,
        });
        return response.data;
    },

    healthCheck: async (): Promise<{ status: string; service: string }> => {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    },
};
