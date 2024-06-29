import jwt from 'jsonwebtoken';

export async function decodeJwt(token: string, userIdKey: string): Promise<string | null> {
    try {
        const decoded = jwt.decode(token.replace('Bearer ', ''));
        if (decoded && typeof decoded === 'object' && userIdKey in decoded) {
            return decoded[userIdKey] as string;
        }
        return null;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
