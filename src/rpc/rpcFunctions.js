import { convertHtmlToPdf } from "../services/pdfService.js"
import {logger} from '../utils/logger.js'

export const htmlToPdfFunction = {
    name: 'htmlToPdf',
    arguments: {
        html: { 
        type: 'string', 
        description: 'Base64 encoded HTML content to convert to PDF', 
        required: true 
        },
    },
    implementation: async (args, context) => {
        try {
            logger.info('html to pdf conversion requested')
            const result = await convertHtmlToPdf(args);
            return {...result, context};
        } catch (error) {
            return {
                success: false,
                code: error.code,
                message: error.message,
                context
            }
        }
    }

}