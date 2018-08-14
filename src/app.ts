#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as path from 'path';
import * as yargs from 'yargs';
import * as readline from 'readline';
import chalk from 'chalk';

const argv = yargs
    .usage('Usage: jsbackup <option> [file1 file2 ... outfile]')
    .example('$0 -c file1.txt file2.txt files.tar.gz',
        'compresses file1.txt and file2.txt into files.tar.gz')
    .example('$0 -x files.tar.gz', 'extracts files.tar.gz to files/')
    .alias('x', 'extract')
    .alias('c', 'compress')
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .version()
    .argv;

function error(err: string): void {
    console.error(chalk.bold.red(err));
    process.exit(1);
}

function commandLine(): void {
    const compress = argv.c;
    const extract = argv.x;
    if (compress && extract) {
        error('Cannot have both \'x\' and \'c\'. Exiting.');
    }
    let fileList: Array<string>;
    let outFile: string;

    if (argv._.length === 1) {
        if (compress) {
            error('Need at least 2 arguments for compression; received 1. Exiting.');
        }
        outFile = argv._.pop();
        extractTarball(outFile).then(() => {
            console.log(chalk.bold.green('done'));
            process.exit(0);
        });
    } else {
        fileList = argv._.slice(0);
        outFile = fileList.pop();
        compressFiles(fileList, outFile).then(() => {
            console.log(chalk.bold.green('done'));
        });
    }
}

/**
 * Extracts the given tarball
 * @param file tarball to extract
 */
export function extractTarball(file: string): Promise<void> {
    return tar.extract({
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
export function compressFiles(files: string[], outfile: string, shouldCreate: boolean = true): Promise<void> {
    if (!fs.existsSync(path.dirname(outfile)) && shouldCreate) {
        fs.mkdirpSync(path.dirname(outfile));
    }
    return tar.create({
        gzip: true,
        file: outfile
    }, files);
}

if (require.main === module) {
    commandLine();
}
