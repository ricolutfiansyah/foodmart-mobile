import { AxiosError } from "axios";

export interface PaginationMeta {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: PaginationMeta;
}

export interface ValidationError {
    field: string,
    message: string
}

export interface ValidationErrorResponse {
    success: false,
    message: string
    errors?: ValidationError[]
}

export type ApiAxiosError = AxiosError<ValidationErrorResponse>

export const getErrorMessage = (error: ApiAxiosError): string => {
    if (!error.response) return 'Koneksi terputus';

    switch (error.response.status) {
        case 401: return 'Sesi habis, silakan login ulang';
        case 403: return 'Anda tidak memiliki akses';
        case 404: return 'Data tidak ditemukan';
        case 409: return 'Data sudah ada';
        case 500: return 'Server sedang bermasalah';
        case 503: return 'Server maintenance';
        default: return error.response?.data?.message ?? error.message;
    }
};