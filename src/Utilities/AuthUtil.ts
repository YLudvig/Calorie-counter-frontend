/* import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    email: string;
    userId: number;
    name: string;
    issuedAt: number
    expiration: number;
} */

//Misstänker att denna filen inte gör något alls, därav onödig

/* export const setAuthToken = (token: string): void => {
    localStorage.setItem('token', token);
}

export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
}

export const deleteAuthToken = (): void => {
    localStorage.removeItem('token');
} */

export const logout = (): void => {
    localStorage.clear();
}

/* export const setUserId = (userId: number): void => {
    localStorage.setItem('userId', userId.toString());
}

export const decodeToken = (token: string): JwtPayload => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        throw new Error('Error decoding JWT');
    }
}

export const getUserIdFromToken = (token: string): number => {
    try {
        const decodedToken = decodeToken(token);
        if (!decodedToken.userId) {
            throw new Error('User ID not found in token');
        }
        return decodedToken.userId;
    } catch (error) {
        console.error('Error getting user ID from token:', error);
        throw new Error('Error getting user ID from token');
    }
} */