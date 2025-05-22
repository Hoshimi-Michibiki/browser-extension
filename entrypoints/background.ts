import { logger } from '@/utils/logger';
import { success } from 'zod/v4';

export default defineBackground(() => {
  logger.info('Hello from background script!', { id: browser.runtime.id });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      logger.debug(`Processing fetch request from sender: `, sender);
      if (message.action === "fetchData") {
        (async () => {
          try {
            const res = await fetch(message.url);
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            logger.debug(`Fetching success`, data);
            sendResponse({ data: data, success: true});
          } catch (error: any) {
            logger.debug(`Fetching failed`, error);
            sendResponse({ error: error.message, success: false});
          }
        })();
        return true;
      }
    }
  );
});
