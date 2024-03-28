import logger from "../logger";


/**
 * This function deletes a database from the indexedDB local storage.
 */
export function deleteLocalDB(dbName: string, callBack?: (res: 'success' | 'error') => void) {
    const request = indexedDB.deleteDatabase(dbName);
    
    request.onsuccess = () => {
        logger.log('system:file', `${dbName} deleted successfully`);
        if (callBack) callBack('success');
    };
    
    request.onerror = (event) => {
        const error = (event.target as IDBRequest).error;
        logger.error('system:file', `Error deleting database ${dbName}:`, error);
        if (callBack) callBack('error');
    };
}


/**
 * This function is used to specifically delete a TLDraw database in the indexedDB local storage.
 * It removes the database and the database name from the `TLDRAW_DB_NAME_INDEX_v2` in the local storage.
 * It also adds the `TLDRAW_DOCUMENT_v2` prefix to the database name.
 */
export function deleteLocalTLDrawDB(dbName: string, callBack?: (res: 'success' | 'error') => void) {

    // Add the `TLDRAW_DOCUMENT_v2` prefix
    const _dbName = 'TLDRAW_DOCUMENT_v2' + dbName;

    const _callback = (res: 'success' | 'error') => {
        if (res === 'success') {
            const localCapsulesIndex = localStorage.getItem('TLDRAW_DB_NAME_INDEX_v2');
            if (localCapsulesIndex) {
                const localCapsulesKeys = JSON.parse(localCapsulesIndex) as string[];
                const newLocalCapsulesKeys = localCapsulesKeys.filter((key) => key !== _dbName);
                localStorage.setItem('TLDRAW_DB_NAME_INDEX_v2', JSON.stringify(newLocalCapsulesKeys));
            }
        }
        if (callBack) callBack(res);
    }
    
    deleteLocalDB(_dbName, _callback);
}


export async function getLocalTLDrawDocName(dbName: string) {
    // Tldraw stores a local IndexedDB with the prefix `TLDRAW_DOCUMENT_v2`
    // Inside this DB, the document is stored into the 'records' table
    // inside this table, there's a `document:document` key that contains an object with the `name` property

    const _dbName = 'TLDRAW_DOCUMENT_v2' + dbName;

    return new Promise<string>((resolve, reject) => {
        const request = indexedDB.open(_dbName);

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction('records', 'readonly');
            const store = transaction.objectStore('records');
            const request = store.get('document:document');

            request.onsuccess = () => {
                const doc = request.result;
                if (doc) {
                    resolve(doc.name);
                } else {
                    reject('Document not found');
                }
            };

            request.onerror = (event) => {
                const error = (event.target as IDBRequest).error;
                reject(error);
            };
        };

        request.onerror = (event) => {
            const error = (event.target as IDBRequest).error;
            reject(error);
        };
    });
}

/*
export async function getLocalTLDrawSnapshot(dbName: string) {
}
*/