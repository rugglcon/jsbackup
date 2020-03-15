import { path7za } from '7zip-bin';
import { dirname, extname } from 'path';
import { create as createTar } from 'tar';
import AdmZip from 'adm-zip';
import { existsSync, mkdirp } from 'fs-extra';
import { error, ArchiveType, checkExists } from './utils';

async function compressZip(outfile: string, files: string[]): Promise<void> {
    const extension = extname(outfile);
    if (extension !== '.zip') {
        error(`Invalid extension given to compress to .zip. Expected .zip, received: ${extension}.`);
    }

    const zip = new AdmZip();
    files.forEach(file => zip.addLocalFile(file));
    zip.writeZip(outfile);
}

async function compressTarGz(outfile: string, files: string[]): Promise<void> {
    const parts = outfile.split('.');
    const gz = parts.pop();
    const tar2 = parts.pop();
    if (gz !== 'gz' && tar2 !== 'tar') {
        error(`Invalid extension given to compress to tar.gz. Expected tar.gz, received: ${tar2}.${gz}.`);
    }

    await createTar({
        gzip: true,
        file: outfile
    }, files);
}

async function compress7z(outfile: string, files: string[]): Promise<void> {
    if (extname(outfile) !== '.7z') {
        error(`Invalid extension given to compress to .7z. Expected .7z, received ${extname(outfile)}`);
    }

    await new Zip().add(outfile, files, {
        $bin: path7za,
        noArchiveOnFail: true
    });
}

/**
 * Compresses `files` into `outfile`, and creates necessary
 * top-level directories in the path contained in `outfile`
 * @param files files to compress
 * @param outfile name of the outputted archive
 */
export async function compressFiles(type: ArchiveType, outfile: string, ...files: string[]): Promise<void> {
    if (!existsSync(dirname(outfile))) {
        await mkdirp(dirname(outfile));
    }

    files.forEach(checkExists);

    switch (type) {
        case ArchiveType['tar.gz']:
            return await compressTarGz(outfile, files);
        case ArchiveType.zip:
            return await compressZip(outfile, files);
        case ArchiveType['7z']:
            return await compress7z(outfile, files);
        default:
            const extension = extname(outfile);
            throw new Error(`jsbackup: File type ${extension} not supported.`);
    }
}
