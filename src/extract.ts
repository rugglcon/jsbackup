import { path7za } from '7zip-bin';
import { dirname, extname } from 'path';
import { extract as extractTar } from 'tar';
import AdmZip from 'adm-zip';
import { checkExists, ArchiveType } from './utils';
import * as Zip from '7z-extract';

/**
 * Extracts the given tarball
 * @param file tarball to extract
 */
async function extractTarball(file: string): Promise<void> {
    await extractTar({
        file: file
    });
}

async function extractZip(file: string): Promise<void> {
    checkExists(file);

    const zip = new AdmZip(file);
    zip.extractAllTo(file.split('.zip')[0], true);
}

async function extract7z(file: string): Promise<void> {
    await Zip.extractFull(file, dirname(file), {
        $bin: path7za,
        recursive: true
    });
}

/**
 * Extracts the given file
 * @param file tarball to extract
 */
export async function extractArchive(type: ArchiveType, file: string): Promise<void> {
    checkExists(file);

    switch (type) {
        case 'tar.gz':
            return await extractTarball(file);
        case 'zip':
            return await extractZip(file);
        case '7z':
            return await extract7z(file);
        default:
            const extension = extname(file);
            throw new Error(`jsbackup: File type '${extension}' not supported.`);
    }
}
