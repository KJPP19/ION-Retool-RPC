import puppeteer from "puppeteer";
import { JSDOM } from 'jsdom';
import { CONFIG } from "../config/index.js";
import { logger } from '../utils/logger.js';
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

// Helper function to extract page contents using JSDOM
function extractPageContentsWithDOM(fullHtml) {
    try {
        const dom = new JSDOM(fullHtml);
        const document = dom.window.document;
        const body = document.body;
        
        if (!body) {
            logger.warn('No body element found in HTML');
            return [];
        }
        
        // Find all elements with class attribute
        const elementsWithClass = body.querySelectorAll('[class]');
        const pages = [];
        
        elementsWithClass.forEach((element) => {
            const classList = Array.from(element.classList);
            
            // Check if it has "page" as a standalone class
            if (classList.includes('page')) {
                // Get clean text content
                const cleanContent = element.textContent
                    .replace(/\s+/g, ' ')
                    .trim();
                
                // Create preview (first 200 characters)
                const preview = cleanContent.length > 200 
                    ? cleanContent.substring(0, 200) + '...' 
                    : cleanContent;
                
                // Get inner HTML content
                const fullContent = element.innerHTML;
                
                pages.push({
                    index: pages.length + 1,
                    id: element.id || null,
                    classes: classList.join(' '),
                    tagName: element.tagName.toLowerCase(),
                    preview: preview,
                    fullContent: fullContent,
                    cleanContent: cleanContent,
                    contentLength: fullContent.length,
                    textLength: cleanContent.length
                });
            }
        });
        
        return pages;
    } catch (error) {
        logger.error('Error parsing HTML with JSDOM:', error);
        return [];
    }
}

// Helper function to log page contents in a readable format
function logPageContents(pageElements) {
    logger.info(`\n${'='.repeat(60)}`);
    logger.info(`FOUND ${pageElements.length} PAGES`);
    logger.info(`${'='.repeat(60)}`);
    
    pageElements.forEach((pageData) => {
        logger.info(`\n--- PAGE ${pageData.index} ---`);
        logger.info(`Tag: <${pageData.tagName}>`);
        logger.info(`ID: ${pageData.id || 'no-id'}`);
        logger.info(`Classes: ${pageData.classes}`);
        logger.info(`Content Length: ${pageData.contentLength} chars (HTML)`);
        logger.info(`Text Length: ${pageData.textLength} chars (clean text)`);
        logger.info(`Preview: ${pageData.preview}`);
        
        // Log a sample of the HTML content if it's not too long
        if (pageData.fullContent.length <= 500) {
            logger.info(`Full HTML Content: ${pageData.fullContent}`);
        } else {
            const htmlPreview = pageData.fullContent.substring(0, 300) + '...';
            logger.info(`HTML Content Preview: ${htmlPreview}`);
        }
        
        logger.info(`${'-'.repeat(40)}`);
    });
    
    logger.info(`${'='.repeat(60)}\n`);
}

export const convertHtmlToPdf = async (args) => {
    let browser = null;

    try {
        logger.info('Starting PDF conversion...');
        const timeout = 500000;
        
        try {
            const launchOptions = {
                headless: true,
                executablePath: '/usr/bin/google-chrome',
                args: CONFIG.PDF.BROWSER_ARGS,
                timeout: timeout,
                protocolTimeout: timeout
            };
            browser = await puppeteer.launch(launchOptions);
            logger.info('Browser launched successfully');
        } catch (error) {
            logger.error("Failed to launch puppeteer browser", error);
            throw new BrowserLaunchError("Failed to launch puppeteer browser");
        }
        
        try {
            const page = await browser.newPage();
            page.setDefaultTimeout(500000);
            page.setDefaultNavigationTimeout(500000);
            
            // Decode HTML from base64
            const fullHtml = Buffer.from(args.html, 'base64').toString('utf8');
            logger.info(`HTML size: ${fullHtml.length} characters`);
            
            // Extract and analyze page contents using JSDOM
            const pageElements = extractPageContentsWithDOM(fullHtml);
            
            // Log detailed page information
            logPageContents(pageElements);
            
            // Additional summary info
            if (pageElements.length > 0) {
                const totalTextLength = pageElements.reduce((sum, page) => sum + page.textLength, 0);
                const totalHtmlLength = pageElements.reduce((sum, page) => sum + page.contentLength, 0);
                const avgTextPerPage = Math.round(totalTextLength / pageElements.length);
                
                logger.info(`SUMMARY STATISTICS:`);
                logger.info(`- Total pages found: ${pageElements.length}`);
                logger.info(`- Total text content: ${totalTextLength} characters`);
                logger.info(`- Total HTML content: ${totalHtmlLength} characters`);
                logger.info(`- Average text per page: ${avgTextPerPage} characters`);
                
                // List all page IDs and classes
                const pageInfo = pageElements.map(p => `${p.index}: ${p.id || 'no-id'} (${p.classes})`);
                logger.info(`- Page structure: ${pageInfo.join(', ')}`);
            } else {
                logger.warn('No pages with class="page" found in the HTML!');
                
                // Fallback: check what classes exist
                try {
                    const dom = new JSDOM(fullHtml);
                    const allElements = dom.window.document.body?.querySelectorAll('[class]') || [];
                    const allClasses = new Set();
                    
                    allElements.forEach(el => {
                        el.classList.forEach(cls => allClasses.add(cls));
                    });
                    
                    logger.info(`Available classes in HTML: ${Array.from(allClasses).join(', ')}`);
                } catch (fallbackError) {
                    logger.error('Error in fallback class detection:', fallbackError);
                }
            }
            
            // Set content and generate PDF
            logger.info('Setting HTML content to page...');
            await page.setContent(fullHtml, { 
                waitUntil: 'domcontentloaded',
                timeout: timeout
            });
            
            logger.info('Generating PDF...');
            const pdfOptions = generatePdfOptions(timeout);
            const pdfBuffer = await page.pdf(pdfOptions);
            const base64String = Buffer.from(pdfBuffer).toString('base64');
            
            logger.info(`PDF generated successfully. Size: ${pdfBuffer.length} bytes`);
            
            return {
                success: true,
                message: 'HTML converted to PDF base64',
                data: {
                    base64: base64String,
                    pageCount: pageElements.length,
                    pages: pageElements.map(p => ({
                        index: p.index,
                        id: p.id,
                        classes: p.classes,
                        textLength: p.textLength
                    }))
                }
            };
            
        } finally {
            if (browser) {
                await browser.close();
                logger.info('Browser closed');
            }
        }
    } catch (error) {
        logger.error("PDF conversion error:", error);
        throw error;
    }
};