import express from 'express';
import { CONFIG } from './config/index.js';
import { createRPCClient } from './rpc/client.js';
import { htmlToPdfFunction } from './rpc/rpcFunctions.js';
import {logger} from './utils/logger.js'

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
    res.json({
        status: 'server is running',
        service: 'Retool HTML to PDF',
        version: CONFIG.RETOOLRPC.VERSION,
        timestamp: new Date().toISOString()
    });
});

app.listen(CONFIG.SERVER.PORT, () => {
    logger.info(`Server running on port ${CONFIG.SERVER.PORT}`)
})

const rpc = createRPCClient();

rpc.register(htmlToPdfFunction);

rpc.listen()
    .then(() => {
        logger.info('Retool RPC client started successfully', {
            host: CONFIG.RETOOLRPC.HOST
        })
    })
    .catch((error) => {
        logger.error('Failed to start Retool RPC client', {
            error: error.message,
            stack: error.stack
        });
        process.exit(1)
    })

