import axios, { AxiosError } from 'axios';
import type { Analysis } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

axios.defaults.withCredentials = true;

export interface ApiErrorResponse {
    error: string;
    error_type?: string;
    message?: string;
}

export class CustomApiError extends Error {
    errorType: string;
    userMessage: string;

    constructor(errorType: string, message: string, userMessage: string) {
        super(message);
        this.errorType = errorType;
        this.userMessage = userMessage;
        this.name = 'CustomApiError';
    }
}

export const api = {
    analyzeRepository: async (repoUrl: string): Promise<Analysis> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
                repo_url: repoUrl,
            });

            // Check if response contains an error (for no_beginner_issues case)
            if (response.data.error) {
                const errorData = response.data as ApiErrorResponse;
                throw new CustomApiError(
                    errorData.error_type || 'unknown_error',
                    errorData.error,
                    errorData.message || errorData.error
                );
            }

            return response.data;
        } catch (error) {
            if (error instanceof CustomApiError) {
                throw error;
            }

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;

                // Network error
                if (!axiosError.response) {
                    throw new CustomApiError(
                        'network_error',
                        'Network error',
                        'Unable to connect to the server. Please check your internet connection and try again.'
                    );
                }

                // API error response
                const errorData = axiosError.response.data;
                throw new CustomApiError(
                    errorData.error_type || 'api_error',
                    errorData.error || 'Unknown error',
                    errorData.message || 'An unexpected error occurred. Please try again.'
                );
            }

            // Unknown error
            throw new CustomApiError(
                'unknown_error',
                'Unknown error',
                'An unexpected error occurred. Please try again.'
            );
        }
    },

    healthCheck: async (): Promise<{ status: string; service: string }> => {
        const response = await axios.get(`${API_BASE_URL}/health`);
        return response.data;
    },
};
