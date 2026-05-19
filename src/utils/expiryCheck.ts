import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number;
}

export const isTokenExpired = (token: string) => {
    if (!token) return true;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded) return true;

        const currentTime = Math.floor(new Date().getTime() / 1000);

        return currentTime >= decoded.exp;
    } catch (error) {
        console.error("Token decode error:", error);
        return true;
    }
};