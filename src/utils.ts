import { existsSync } from 'fs-extra';

/**
 * All types of archives this supports
 */
export enum ArchiveType {
    'zip' = 'zip',
    'tar.gz' = 'tar.gz',
    '7z' = '7z'
}

/**
 * Writes an error to the console and then exits with code 1
 * @param err the error to write to the console
 */
export function error(err: string) {
    throw new Error(err);
}

/**
 * checks if a file exists and if not, throws an error.
 * @param file the full path to the file to check
 */
export function checkExists(file: string) {
    if (!existsSync(file)) {
        throw new Error(`jsbackup: ${file} does not exist.`);
    }
}
