#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as path from 'path';
import * as yargs from 'yargs';
import chalk from 'chalk';

function error(err: string): void {
    console.error(`jsbackup: ${chalk.bold.red(err)}`);
    process.exit(1);
}

async function commandLine(): Promise<void> {
    const argv = yargs
    .usage('Usage: jsbackup <option> [[outfile file1 file2 ...] | [tarball]]')
    .example('$0 -c files.tar.gz file1.txt file2.txt',
        'compresses file1.txt and file2.txt into files.tar.gz')
    .example('$0 -x files.tar.gz', 'extracts files.tar.gz to files/')
    .boolean('c')
    .boolean('x')
    .describe('c', 'compress a list of files')
    .describe('x', 'extract a tarball')
    .alias('x', 'extract')
    .alias('c', 'compress')
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .version()
    .argv;

    const compress = argv.c;
    const extract = argv.x;
    if (compress && extract) {
        error('Cannot have both \'x\' and \'c\'. Exiting.');
    }
    let fileList: Array<string>;
    let outFile: string;

    if (compress) {
        if (argv._.length <= 1) {
            error(`Need at least 2 arguments for compression; receieved ${argv._.length}. Exiting.`);
        }

        fileList = argv._.slice(0);
        outFile = fileList.shift();
        await compressFiles(outFile, ...fileList);
        console.log(chalk.bold.green('done'));
        process.exit(0);
    }

    if (extract) {
        if (argv._.length !== 1) {
            error(`Can only have one argument for extraction but receieved ${argv._.length}. Exiting.`);
        }

        outFile = argv._.pop();
        await extractTarball(outFile);
        console.log(chalk.bold.green('done'));
        process.exit(0);
    }
}

/**
 * Extracts the given tarball
 * @param file tarball to extract
 */
export async function extractTarball(file: string): Promise<void> {
    await tar.extract({
        file: file
    });
}

/**
 * Compresses `files` into `outfile`, optionally creating necessary
 * top-level directories in the path contained in `outfile`
 * @param files files to compress
 * @param outfile name of the outputted `.tar.gz`
 * @param shouldCreate whether or not it should create missing directories if given a full path for the `outfile`. Defaults to `true`
 */
export async function compressFiles(outfile: string, ...files: string[]): Promise<void> {
    if (!fs.existsSync(path.dirname(outfile))) {
        await fs.mkdirp(path.dirname(outfile));
    }
    files.forEach(file => {
        if (!fs.existsSync(file)) {
            throw new Error(`jsbackup: ${file} does not exist.`);
        }
    });
    await tar.create({
        gzip: true,
        file: outfile
    }, files);
}

if (require.main === module) {
    commandLine();
}
