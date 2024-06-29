import { decodeJwt } from './jwt';

export async function transformHeaders(
    headers: Record<string, string | string[] | undefined>,
    transformations: Record<string, string>
): Promise<void> {
    for (const [key, value] of Object.entries(transformations)) {
        if (value.startsWith('${') && value.endsWith('}')) {
            const sourceKey = value.slice(2, -1);
            if (sourceKey in headers) {
                headers[key] = headers[sourceKey];
            }
        } else {
            headers[key] = value;
        }
    }
}

export async function processJwtHeader(
    headers: Record<string, string | string[] | undefined>,
    jwtConfig: { headerName: string; userIdKey: string }
): Promise<void> {
    const token = headers[jwtConfig.headerName.toLowerCase()] as string | undefined;
    if (token) {
        const userId = await decodeJwt(token, jwtConfig.userIdKey);
        if (userId) {
            headers['x-user-id'] = userId;
        }
    }
}
