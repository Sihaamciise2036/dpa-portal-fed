import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
}
export default isTokenExpired;
