import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    host_permissions: [
      "*://*.google.com/*",
      "*://*.youtube.com/*",
      // "*://*.spotify.com/*",
      // "*://*.apple.com/*",
      "http://localhost/*"
    ]
  }
});
