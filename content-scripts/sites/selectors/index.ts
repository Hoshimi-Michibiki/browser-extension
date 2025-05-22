import localSelectors from './selectors.json';
import { fetchData } from '@/utils/background-helpers';
import { z } from "zod";

// TODO: implement caching with storage service

// another const so we won't have to change all the variable name next time
const defaultSelectors = localSelectors;

// change to 'main' on production
const remoteSelectorBranchName = `dev`;
const remoteSelectorUrl = 
    `https://raw.githubusercontent.com/Hoshimi-Michibiki/browser-ext-remote-config/refs/heads/`
    + remoteSelectorBranchName
    + `/config/selectors/selectors.json`;

// json validation
const selectorSchema = z.object({
    css: z.record(z.string()),
    xpath: z.record(z.string()),
});
const expectedResponse = z.record(selectorSchema);

export async function selectors(): Promise<typeof defaultSelectors | null> {
    const remoteSelectors = await fetchSelectors(remoteSelectorUrl);
    let toUseSelectors = remoteSelectors ?? defaultSelectors;
    try {
        logger.debug(`Validating selectors...`, toUseSelectors);
        expectedResponse.parse(toUseSelectors);
    } catch (error) {
        logger.error(`Validation has failed, this is not good. Please create an issue on github. Thank you!`, toUseSelectors);
        return null;
    }
    return toUseSelectors;
};

export async function fetchSelectors(url: string): Promise<typeof defaultSelectors | null> {
    try {
        logger.debug(`Fetching selectors from`,remoteSelectorUrl);
        const res = await fetchData(url);
        if (!res.success) throw new Error(`HTTP ${res.status}`);
        logger.info(`Successfully fetched remote selectors`);
        const data = await res.data;
        logger.debug(`Fetched data: `,data);
        return data;
    } catch (error) {
        logger.warn(`Failed to fetch remote selectors. Will use default fallback`, error);
        return null;
    }
}