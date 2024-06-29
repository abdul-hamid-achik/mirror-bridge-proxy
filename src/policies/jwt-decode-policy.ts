import type { Policy } from './policy';
import { decodeJwt } from '../utils/jwt';

export class JwtDecodePolicy implements Policy {
    name = 'JwtDecode';

    async execute(request: any, config: any): Promise<void> {
        const { headerName, userIdKey } = config;
        const token = request.headers[headerName.toLowerCase()] as string;
        if (token) {
            const userId = await decodeJwt(token, userIdKey);
            if (userId) {
                request.headers['x-user-id'] = userId;
            }
        }
    }
}
