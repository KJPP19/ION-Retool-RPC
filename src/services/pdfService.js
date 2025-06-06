import puppeteer from "puppeteer";
import { CONFIG } from "../config/index.js";
import {logger} from '../utils/logger.js'
import { BrowserLaunchError } from "../errors/customErrors.js";

export const generatePdfOptions = (timeout) => {
    const pdfOptions = {
      printBackground: true,
      format: 'A4',
      landscape: false,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      displayHeaderFooter: false,
      scale: 0.8,
      preferCSSPageSize: true,
      timeout: timeout
    };
  
    return pdfOptions;
  };

export const convertHtmlToPdf = async (args) => {
    let browser = null;

    try {
        logger.info('starting pdf conversion')
        const timeout = 500000;
        
        try {
            const launchOptions = {
                headless: true,
                executablePath: '/usr/bin/google-chrome',
                args: CONFIG.PDF.BROWSER_ARGS,
                timeout: timeout, // Increase browser launch timeout
                protocolTimeout: timeout
            };
            browser = await puppeteer.launch(launchOptions);
            logger.info('browser launched');
        } catch (error) {
            logger.error("failed to launch puppeteer browser", error)
            throw new BrowserLaunchError("failed to launch puppeteer browser")
        }
        
        try {
            const page = await browser.newPage();
            page.setDefaultTimeout(500000); // Set default timeout to 5 minutes
            page.setDefaultNavigationTimeout(500000);
            const fullHtml = Buffer.from(args.html, 'base64').toString('utf8');
            logger.info("decoded base64 html success");
            logger.info(`HTML size: ${fullHtml.length} characters`);
            await page.setContent(fullHtml, { 
                waitUntil: 'domcontentloaded',
                timeout: timeout
            });

            const pdfOptions = generatePdfOptions(timeout);
            const pdfBuffer = await page.pdf(pdfOptions);
            const base64String = Buffer.from(pdfBuffer).toString('base64');
            return {
                success: true,
                message: 'html coverted to pdf base64',
                data: {
                    base64: base64String
                }
            }
        } finally {
            await browser.close();
        }
    } catch (error) {
        logger.info("check", error)
        throw error
    }
}