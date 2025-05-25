import { mountInjectedComponent } from "@/content-scripts/ui-injector";
import MusicSiteButton from "@/components/injected-ui/MusicSiteButton.vue";
import { selectors } from "../selectors";
import { waitForElementByXPath, waitForElementBySelector, observeDOM } from "@/utils/dom-helpers";
import { logger } from '@/utils/logger';
import { ContentScriptContext } from "#imports";

import pureCssContent from '@/public/material-you/css/material-design-light.min.css?inline';

export const hostnamePatterns: RegExp[] = [/^(?:www\.)google\.com$/i];

let unmountFunctions: InjectedComponents[] = [];

async function injectButtonIntoPlayer(context: ContentScriptContext) {
    try {
        const sel = await selectors();
        if (!sel) {
            throw new Error(`We can't work without selectors.`);
        };
        const playBar = await waitForElementByXPath(sel.google.xpath.searchBarButtonsParent);
        if (playBar && !playBar.querySelector('.michibiki-injected-button')) {
            logger.info(`Injecting our cute button...`);
            const mountPoint = document.createElement('div');
            mountPoint.className = 'michibiki-injected-button';
            playBar.appendChild(mountPoint);
            logger.debug(`playbar: `, playBar);
            const { unmount, componentName } = await mountInjectedComponent(
                context,
                MusicSiteButton,
                mountPoint,
                { msg: 'Ext Action'},
                'Component name here',
                pureCssContent
            );
            unmountFunctions.push({componentName, unmount});
            // return; // just testing
            unmountFunctions.forEach(({unmount, componentName})=>{
                logger.debug(unmount, componentName);
                // this is to unmount the only needed component
                // if (componentName === 'Component name here') {
                //     unmount();
                // }
            });
            logger.warn(`execution stops here..`);
        } else {
            logger.info(`Seems like the cute button has already exists or injection has failed`);
        }
    } catch (error) {
        logger.error(`Ouch... error!`, error);
    }
}

export const init = (context: ContentScriptContext): void => {
    logger.info(`Adapter for Google initialized!`);
    injectButtonIntoPlayer(context);
};