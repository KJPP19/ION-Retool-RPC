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
            '--single-process', // Important for limited memory
            '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=VizDisplayCompositor',
            '--max-old-space-size=1024' // Reduced for Render's memory limits
        ],
        EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH
    }
}