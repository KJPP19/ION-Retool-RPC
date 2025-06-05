import dotenv from 'dotenv'

dotenv.config()

export const CONFIG = {
    SERVER: {
        PORT: process.env.PORT || 8080,
    },

    RETOOLRPC: {
        API_TOKEN: process.env.RETOOL_API_TOKEN,
        HOST: process.env.RETOOL_HOST,
        RESOURCE_ID: process.env.RETOOL_RESOURCE_ID,
        ENVIRONMENT: process.env.RETOOL_ENV,
        POLLING_INTERVAL: 1000,
        VERSION: '0.0.1',
        LOG_LEVEL: 'info'
    },

    PDF: {
        BROWSER_ARGS: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one is important for Docker
            '--disable-gpu'
        ],
    }
}