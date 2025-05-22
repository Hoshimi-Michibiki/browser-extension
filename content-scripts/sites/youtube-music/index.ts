import { mountInjectedComponent } from "@/content-scripts/ui-injector";
import MusicSiteButton from "@/components/injected-ui/MusicSiteButton.vue";
import { selectors } from "../selectors";
import { waitForElementBySelector, waitForElementByXPath, observeDOM } from "@/utils/dom-helpers";
import { logger } from '@/utils/logger';
import { ContentScriptContext } from "#imports";

export const hostnamePatterns: RegExp[] = [/^(?:www\.)?music\.youtube\.com$/i];

let unmountFunctions: (() => void)[] = [];

async function injectButtonIntoPlayer(context: ContentScriptContext) {
    try {
        const sel = await selectors();
        if (!sel) {
            throw new Error(`We can't work without selectors.`);
        };
        logger.info(`Fetching selectors...`);
        const playBar = await waitForElementBySelector(sel.youtubeMusic.css.playButton);
        if (playBar && !playBar.querySelector('.michibiki-injected-button')) {
            logger.info(`Injecting our cute button...`);
            const mountPoint = document.createElement('div');
            mountPoint.className = 'michibiki-injected-button';
            playBar.appendChild(mountPoint);
            logger.warn(`execution stops here..`);
            // const { unmount } = await mountInjectedComponent(
            //     context,
            //     MusicSiteButton,
            //     { siteName: 'Youtube', buttonText: 'Ext Action'},
            //     mountPoint,
            // );
            // unmountFunctions.push(unmount);
        } else {
            logger.info(`Seems like the cute button has already exists or injection has failed`);
        }
    } catch (error) {
        logger.error(`Ouch... error!`, error);
    }
}

export const init = (context: ContentScriptContext): void => {
    logger.info(`Adapter for Youtube Music initialized!`);
    injectButtonIntoPlayer(context);
};