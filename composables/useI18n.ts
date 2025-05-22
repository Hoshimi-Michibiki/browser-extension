/**
 * a composable for vue components to access localization features
 */
export function useI18n() {
    /**
     * get the chosen lang string for the input msg key
     * @param key see the key list in messages.json
     * @param substitutions in short, it replaces the $placeholder, $anotherPlaceholder, ... in _locales\*\messages.json. 
     * @returns String in the chosen lang, else return key (logged)
     */
    const t = (key: string, substitutions?: string | string[]): string => {
        try {
            const message = getI18nMessage(key, substitutions);
            if (!message && key) {
                console.warn(`[i18n] Key '${key}' can't be found or message is empty, returning key instead.`);
                return key;
            }
            return message;
        } catch (error) {
            console.error(`[i18n] Key '${key}' can't be found.`);
            return key;
        }
    };

    /**
     * get browser default lang
     * @returns ("en", "vi")
     */
    const getUILanguage = (): string => {
        return browser.i18n.getUILanguage();
    };

    /**
     * helper type cast function
     */
    const getI18nMessage = (key: string, substitutions?: string | string[]): string => {
        return (browser.i18n.getMessage as (key: string, substitutions?: string | string[]) => string)(key, substitutions);
    }

    return {
        t,
        getUILanguage,
    }
}