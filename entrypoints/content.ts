import { initializeSiteAdapters } from '@/content-scripts/site-loader';
import { initGlobalUIManager } from '../content-scripts/global-ui-manager';

export default defineContentScript({
  matches: [
    '*://*.google.com/*',
    '*://*.youtube.com/*',
    ],
  main(context) {
    initGlobalUIManager();
    initializeSiteAdapters(context);
  },
});
