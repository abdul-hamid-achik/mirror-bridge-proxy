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


