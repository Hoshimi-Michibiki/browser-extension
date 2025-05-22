import { logger } from "./logger";

// because of CORS restrictions on content script
export async function fetchData(url: string): Promise<any> {
    try {
        logger.debug(`sending fetchData request to background script`);
        const res = await browser.runtime.sendMessage({
            action: "fetchData",
            url: url
        });
        logger.debug(`got data from background script: `, res);
        return res;
    } catch (error) {
        logger.error(`Error fetching data from background helper`, error);
    }
}