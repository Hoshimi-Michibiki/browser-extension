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

     /**
    * Shows a toast message.
    * @param message The message to display.
    * @param type The type of toast ('info', 'success', 'warning', 'error').
    * @param target Where to show the toast: 'auto', 'page', or 'popup'.
    */
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
    
     /**
    * Shows a confirmation prompt.
    * @param question The question to ask.
    * @param target Where to show the prompt: 'auto', 'page', or 'popup'.
    * @returns Promise<boolean> True if confirmed, false otherwise.
    */
    async showPrompt(
        question: string,
        target: 'auto' | 'page' | 'popup' = 'auto'
    ): Promise<boolean> {
        const currentContext = getContext();
        let resolvedTarget = target;
        const promptId = `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        if (resolvedTarget === 'auto') {
            resolvedTarget = (currentContext === 'popup') ? 'popup' : 'page';
        }
        logger.debug(`showing prompt: "${question}" -> target: ${resolvedTarget}, context: ${currentContext}`);

        return new Promise<boolean>(async (resolve) => {
            const responseListener = (message: any) => {
                if (message.action === 'PROMPT_RESPONSE' && message.promptId === promptId) {
                    browser.runtime.onMessage.removeListener(responseListener);
                    resolve(message.payload.confirmed);
                    return true;
                }
                return false;
            };
            browser.runtime.onMessage.addListener(responseListener);

            const timeoutId = setTimeout(() => {
                browser.runtime.onMessage.removeListener(responseListener);
                logger.warn(`Timeout for prompt: ${promptId}`);
                resolve(false);
            }, 30000);


            const cleanup = () => {
                clearTimeout(timeoutId);
                browser.runtime.onMessage.removeListener(responseListener);
            };

            if (resolvedTarget === 'popup') {
                if (currentContext === 'popup') {
                    window.dispatchEvent(new CustomEvent('show-app-prompt',{ detail : {question, promptId, callback: (confirmed: boolean) => { cleanup(); resolve(confirmed);} } }));
                } else {
                    try {
                        await browser.runtime.sendMessage({ action: 'SHOW_POPUP_PROMPT', payload: { question, promptId } });
                    } catch (error) {
                        logger.debug(`Popup not available for prompt. Falling back to native confirm`, error);
                        cleanup();
                        resolve(confirm(question));
                    }
                }
            } else {
                if (currentContext === 'content_script' || currentContext === 'page_or_unknown_extension_context') {
                    window.dispatchEvent(new CustomEvent('show-page-prompt', { detail: { question, promptId, callback: (confirmed: boolean) => { cleanup(); resolve(confirmed); } } }));
                } else {
                    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });
                    if (activeTab?.id) {
                        try {
                            await browser.tabs.sendMessage(activeTab.id, { action: 'SHOW_PAGE_PROMPT', payload: { question, promptId } });
                        } catch (error) {
                            logger.debug(`Content script not listening for page prompt. Fallback to native confirm`, error);
                            cleanup();
                            resolve(confirm(question));
                        }
                    } else {
                        logger.debug(`No active tab for page prompt. Fallback to native confirm.`);
                        cleanup();
                        resolve(confirm(question));
                    }
                }
            }
        });
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
