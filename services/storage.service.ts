export enum StorageType {
    Local = 'local',
    Sync = 'sync',
    Session = 'session'
}

const DEFAULT_STORAGE_AREA = StorageType.Local;

export const storageService = {
    // get item from storage
    async get<T> (key: string, area: StorageType = DEFAULT_STORAGE_AREA) : Promise<T | undefined> {
        try {
            const result = await browser.storage[area].get(key);
            return result[key] as T | undefined;
        } catch (error) {
            logger.debug(`[Storage] Error getting item '${key}' from '${area}' storage:`, error);
            return undefined;
        }
    },

    // save item to storage
    async set<T>(key: string, value: T, area: StorageType = DEFAULT_STORAGE_AREA): Promise<void> {
        try {
            await browser.storage[area].set({ [key]: value });
        } catch (error) {
            logger.debug(`Error setting item '${key}' from '${area}'`);
            throw error;
        }
    },

    // remove 1 or more items from storage
    async remove(keys: string | string[], area: StorageType = DEFAULT_STORAGE_AREA): Promise<void> {
        try {
            await browser.storage[area].remove(keys);
        } catch (error) {
            const keyString = Array.isArray(keys) ? keys.join(', ') : keys;
            logger.debug(`[StorageService] Error removing item(s) '${keyString}' from '${area}'`, error);
            throw error;
        }
    },

    // clear all storage
    async clear(area: StorageType = DEFAULT_STORAGE_AREA): Promise<void> {
        try {
            await browser.storage[area].clear();
            logger.debug(`[StorageService] Cleared all items from ${area} storage.`);
        } catch (error) {
            logger.debug(`[StorageService] Error clearing ${area} storage.`);
            throw error;
        }
    },

    // get multiple key
    async getMultiple<T extends Record<string, any>>(
        keys: (keyof T)[],
        area: StorageType = DEFAULT_STORAGE_AREA
    ): Promise<Partial<T>> {
        try {
            const result = await browser.storage[area].get(keys as string[]);
            return result as Partial<T>;
        } catch (error) {
            logger.debug(`[StorageService] Error getting multiple items from ${area} storage:`, error);
            return {} as Partial<T>;
        }
    },

    // get all
    async getAll<T extends Record<string, any>>(area: StorageType = DEFAULT_STORAGE_AREA): Promise<T> {
        try {
            const result = await browser.storage[area].get(null);
            return result as T;
        } catch (error) {
            logger.debug(`[StorageService] Error getting all items from ${area} storage:`, error);
            return {} as T;
        }
    },
};