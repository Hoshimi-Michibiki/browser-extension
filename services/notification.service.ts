import { logger } from "@/utils/logger";

const getContext = () => {
    if (typeof window === 'undefined' || 
        (
            self.constructor.name !== 'Window' 
            && self.constructor.name !== 'SharedWorkerGlobalScope' 
            && self.constructor.name !== 'ServiceWorkerGlobalScope'
        )
    ) return 'background';
    if (window.location.protocol === 'chrome-extension:') {
        if (window.document.getElementById('wxt-popup')) return 'popup';
    }
    try {
        if (browser.extension && !browser.runtime.getManifest().hasOwnProperty('theme')) return 'content_script';
    } catch (error) {
        return 'page_or_unknown_extension_context';
    }
};

export const notificationService = {

    async showToast(
        message: string,
        type: 'info' | 'success' | 'warning' | 'error' = 'info',
        target: 'auto' | 'page' | 'popup' = 'auto'
    ) {
        const currentContext = getContext();
        let resolvedTarget = target;

        if (resolvedTarget == 'auto') {
            resolvedTarget = (currentContext === 'popup') ? 'popup' : 'page';
        }

        logger.debug(`showToast: "${message}" (type: ${type}) -> target: ${resolvedTarget}, context: ${currentContext}`);

        if (resolvedTarget === 'popup') {
            if (currentContext === 'popup') {
                window.dispatchEvent(new CustomEvent('show-app-toast', {detail: { message, type } }));
                
            } else {
                try {
                    await browser.runtime.sendMessage({
                        action: 'SHOW_POPUP_TOAST',
                        payload: { message, type},
                    });
                } catch (error) {
                    logger.warn(`Popup not available or error sending message for toast. If critical, use native notification.`, error);
                    this.showNativeNotification(message, type);
                }
            }
        } else {
            if (currentContext === 'content_script' || currentContext === 'page_or_unknown_extension_context'){
                window.dispatchEvent(new CustomEvent('show-page-toast', { detail: {message, type} } ));
            } else {
                const [activeTab] = await browser.tabs.query({
                    active: true, currentWindow: true
                });
                if (activeTab?.id) {
                    try {
                        await browser.tabs.sendMessage(activeTab.id, {
                            action: 'SHOW_PAGE_TOAST',
                            payload: { message, type }
                        })
                    } catch (error) {
                        logger.warn(`Content script not listening or error sending message for page toast. Fallback to native.`, error);
                        this.showNativeNotification(message, type);
                    }
                } else {
                    logger.warn(`No active tabs found. Falling back to native method.`);
                    this.showNativeNotification(message, type);
                }
            }
        }
    },
    
    async showPrompt(
        // todo: implement showing prompt logic
    ) {

    },

    showNativeNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
        let title = "Notification";
        if (type === 'success') title = 'Success!';
        else if (type = 'warning') title = 'Warning';
        else if (type = 'error') title = 'Error';

        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('/icon/48.png'),
            title: title,
            message: message
        });
    }
}
