#!/usr/bin/env node
import { existsSync, mkdirp } from 'fs-extra';
import { extract as extractTar, create as createTar } from 'tar';
import { dirname } from 'path';
import * as yargs from 'yargs';
import * as AdmZip from 'adm-zip';
import { bold } from 'chalk';

/**
 * All types of archives this supports
 */
export type ArchiveType = 'zip' | 'tar.gz';

/**
 * Writes an error to the console and then exits with code 1
 * @param err the error to write to the console
 */
const error = (err: string) => {
    throw new Error(err);
};

/**
 * checks if a file exists and if not, throws an error.
 * @param file the full path to the file to check
 */
const checkExists = (file: string) => {
    if (!existsSync(file)) {
        throw new Error(`jsbackup: ${file} does not exist.`);
    }
};

async function commandLine(): Promise<void> {
    const argv = yargs
        .usage('Usage: jsbackup -t <tar.gz|zip> <option> [[outfile file1 file2 ...] | [archive]]')
        .example('$0 -t tar.gz -c files.tar.gz file1.txt file2.txt',
            'compresses file1.txt and file2.txt into files.tar.gz')
        .example('$0 -t tar.gz -x files.tar.gz', 'extracts files.tar.gz to files/')
        .boolean('c')
        .boolean('x')
        .string('t')
        .describe('t', 'the type of archive to extract/compress')
        .describe('c', 'compress a list of files')
        .describe('x', 'extract a tarball')
        .alias('t', 'type')
        .alias('x', 'extract')
        .alias('c', 'compress')
        .nargs('t', 1)
        .demandCommand(1)
        .demandOption('t')
        .help('h')
        .alias('h', 'help')
        .version()
        .argv;

    const compress = argv.c;
    const extract = argv.x;
    const type = argv.t;
    const acceptableTypes = [
        'tar.gz',
        'zip'
    ];
    if (compress && extract) {
        error('Cannot have both \'x\' and \'c\'.');
    }

    if (!type || !acceptableTypes.includes(type)) {
        error(`You must give a valid type. Type given: ${type}.`);
    }

    if (compress) {
        if (argv._.length < 2) {
            error(`Need at least 2 arguments for compression; receieved ${argv._.length}.`);
        }

        const fileList = argv._.slice(0);
        const outFile = fileList.shift();

        await compressFiles(type as ArchiveType, outFile as string, ...fileList);
        console.log(bold.green('done'));
        process.exit(0);
    }

    if (extract) {
        if (argv._.length !== 1) {
            error(`Can only have one argument for extraction but receieved ${argv._.length}.`);
        }

        const outFile = argv._.pop();

        await extractArchive(type as ArchiveType, outFile as string);
        console.log(bold.green('done'));
        process.exit(0);
    }
}

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
    if (!existsSync(file)) {
        throw new Error(`jsbackup: File not found: ${file}`);
    }
    const zip = new AdmZip(file);
    zip.extractAllTo(file.split('.zip')[0], true);
}

async function compressZip(outfile: string, files: string[]): Promise<void> {
    const extension = outfile.split('.').pop();
    if (extension !== 'zip') {
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

/**
 * Extracts the given file
 * @param file tarball to extract
 */
export async function extractArchive(type: ArchiveType, file: string): Promise<void> {
    checkExists(file);

    switch (type) {
        case 'tar.gz':
            return extractTarball(file);
        case 'zip':
            return extractZip(file);
        default:
            const extension = file.split('.').pop();
            throw new Error(`jsbackup: File type ${extension} not supported.`);
    }
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
        case 'tar.gz':
            return compressTarGz(outfile, files);
        case 'zip':
            return compressZip(outfile, files);
            break;
        default:
            const extension = outfile.split('.').pop();
            throw new Error(`jsbackup: File type ${extension} not supported.`);
    }
}

if (require.main === module) {
    commandLine();
}
