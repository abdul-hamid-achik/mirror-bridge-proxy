import jwt from 'jsonwebtoken';

export async function decodeJwt<T>(token: string): Promise<T | null> {
    try {
        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object') {
            return decoded as T;
        }
        return null;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
