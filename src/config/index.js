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
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            
            // Memory optimization
            '--memory-pressure-off',
            '--max-old-space-size=256',
            '--aggressive-cache-discard',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            
            // Disable unnecessary features
            '--disable-extensions',
            '--disable-plugins',
            '--disable-default-apps',
            '--disable-background-networking',
            '--disable-sync',
            '--disable-translate',
            '--disable-web-security',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--disable-accelerated-mjpeg-decode',
            '--disable-accelerated-video-decode',
            
            // Performance
            '--hide-scrollbars',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-pings',
            '--disable-extensions-http-throttling',
            
            // Resource limits
            '--max-unused-resource-memory-usage-percentage=5',
            '--disable-background-mode'
        ],
    }
}