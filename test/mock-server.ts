import express from 'express';
import { Server } from 'http';

export function startMockServer(port: number) {
    return new Promise<Server>((resolve, reject) => {
        const app = express();

        app.use(express.json());

        app.get('/test', (req, res) => {
            console.log('GET /test', req.headers);
            res.json({
                message: 'Test successful',
                headers: req.headers
            });
        });

        app.post('/echo', (req, res) => {
            console.log('POST /echo', req.headers, req.body);
            res.json({
                body: req.body,
                headers: req.headers
            });
        });

        const server = app.listen(port, (err?: Error) => {
            if (err) {
                console.error(`Error starting mock server: ${err.message}`);
                reject(err);
            } else {
                console.log(`Mock server listening on port ${port}`);
                resolve(server);
            }
        });

        server.on('error', (err) => {
            console.error(`Server error: ${err.message}`);
            reject(err);
            server.close();
        });
    });
}
