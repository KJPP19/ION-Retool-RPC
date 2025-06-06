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
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-default-apps',
            '--disable-background-networking',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-pings',
            '--single-process', // Keep this for Docker
            '--disable-ipc-flooding-protection',
            // Memory optimization
            '--memory-pressure-off',
            '--max-old-space-size=4096'
        ],
    }
}