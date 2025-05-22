import { ContentScriptContext } from '#imports';
import { logger } from '@/utils/logger';
import * as youtubeAdapter from './sites/youtube';
import * as youtubeMusicAdapter from './sites/youtube-music';
import * as googleAdapter from './sites/google'
// more adapters here

interface SiteAdapter {
    hostnamePatterns: RegExp[];
    init: (context: ContentScriptContext) => void;
    cleanup?: () => void; // optional
}

const siteAdapters: Record<string, SiteAdapter> = {
    youtube: youtubeAdapter,
    youtubeMusic: youtubeMusicAdapter,
    google: googleAdapter, // for testing
    // more adapters here
};

export function initializeSiteAdapters(context: ContentScriptContext): void { 
    const currentHostName = window.location.hostname;
    logger.info(`Current hostname: '${currentHostName}'`);

    for (const key in siteAdapters) {
        const adapter = siteAdapters[key];
        if (adapter.hostnamePatterns.some(pattern => pattern.test(currentHostName))){
            logger.info(`Loading adapter for: ${key}`);
            try {
                adapter.init(context);
            } catch (error) {
                logger.error(`Error while loading adapter for ${key}`, error);
            }
            // only load the first matching adapter
            return;
        }
    }
    logger.info(`No adapter found for this site. Could be added in the future updates ;)?`);
}