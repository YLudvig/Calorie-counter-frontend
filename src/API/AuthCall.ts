import type {
    LoginRequest,
    RegisterRequest,
    ApiResponse,
    RegisterResponse,
    LoginResponse,
} from "../types/AuthTypes";
import { fetchApi } from "./FetchAPI";


export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetchApi('/user/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Login failed: " + response.statusText);
        }

        const data: LoginResponse = await response.json();
        return data;
    } catch (error) {
        throw new Error("Login failed: " + error);
    }
}

export async function register(
    credentials: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> {
    try {
        const response = await fetchApi('/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error("Registration failed: " + response.statusText);
        }

        const data: ApiResponse<RegisterResponse> = await response.json();
        return data;
    } catch (error) {
        throw new Error("Registration failed: " + error);
    }
}