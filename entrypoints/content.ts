import { initializeSiteAdapters } from '@/content-scripts/site-loader';

export default defineContentScript({
  matches: [
    '*://*.google.com/*',
    '*://*.youtube.com/*',
    ],
  main(context) {
    initializeSiteAdapters(context);
  },
});
