import express from 'express';
import { Server } from 'http';

export function startMockServer(port: number) {
    return new Promise<Server>((resolve) => {
        const app = express();

        app.use(express.json());

        app.get('/test', (req, res) => {
            res.json({
                message: 'Test successful',
                headers: req.headers
            });
        });

        app.post('/echo', (req, res) => {
            res.json({
                body: req.body,
                headers: req.headers
            });
        });

        const server = app.listen(port, () => {
            console.log(`Mock server listening on port ${port}`);
            resolve(server);
        });
    });
}
