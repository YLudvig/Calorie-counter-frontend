export type LoginRequest = {
    email: string;
    password: string;
}

export type RegisterRequest = {
    email: string
    password: string;
    name: string;
}

export type RegisterResponse = {
    message: string;
    success: boolean;
    data: {
        email: string;
        name: string;
    }
}

export type LoginResponse = {
    message: string;
    success: boolean;
    userId: string;
    token: string;
    email: string;
    name: string;
}

export type AuthResponse = {
    jwt: string;
}

export type ApiResponse<T> = {
    message: string;
    success: boolean;
    data: T;
}

export interface User {
  token: string;
  userId: string;
  username: string;
}