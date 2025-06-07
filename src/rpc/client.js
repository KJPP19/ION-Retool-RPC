import { RetoolRPC } from "retoolrpc"
import { CONFIG } from "../config/index.js";
import {logger} from '../utils/logger.js';

export const createRPCClient = () => {
    logger.info('Initializing RPC client');

    const rpc = new RetoolRPC({
        apiToken: CONFIG.RETOOLRPC.API_TOKEN,
        host: CONFIG.RETOOLRPC.HOST,
        resourceId: CONFIG.RETOOLRPC.RESOURCE_ID,
        environmentName: CONFIG.RETOOLRPC.ENVIRONMENT,
        pollingIntervalMs: CONFIG.RETOOLRPC.POLLING_INTERVAL,
        pollingTimeoutMs: 200000,
        version: CONFIG.RETOOLRPC.VERSION,
        logLevel: CONFIG.RETOOLRPC.LOG_LEVEL,
    })

    return rpc
}

