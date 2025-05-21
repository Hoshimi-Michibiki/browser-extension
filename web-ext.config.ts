import { defineWebExtConfig } from 'wxt';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineWebExtConfig({
  binaries: {
    firefox: process.env.FIREFOX_BIN_PATH,
    chrome: process.env.CHROME_BIN_PATH,
    chromimum: process.env.CHROME_BIN_PATH
  },
  firefoxProfile: process.env.FIREFOX_PROFILE_PATH,
  chromiumProfile: process.env.CHROME_PROFILE_PATH,
});