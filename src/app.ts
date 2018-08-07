#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as tar from 'tar';
import * as path from 'path';
import * as yargs from 'yargs';
import * as readline from 'readline';
import chalk from 'chalk';

const argv = yargs
    .usage('Usage: jsbackup [file1 file2 ... outfile|options]')
    .example('$0 file1.txt file2.txt files.tar.gz',
        'compresses file1.txt and file2.txt into files.tar.gz')
    .example('$0',
        'this will start a prompt to enter a list of files and then an output file')
    .help('h')
    .alias('h', 'help')
    .version()
    .argv;

function commandLine(): void {
    let fileList: Array<string>;
    let outFile: string;

    if (argv._.length === 1) {
        yargs.showHelp();
        console.error(chalk.bold.red('Incorrect number of arguments; either 0 or more than 1. Exiting.'));
        process.exit(1);
    } else if (argv._.length === 0) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(chalk.green.bold('Please list the files you would like '
            + 'compressed followed by the file to compress them to: '), list => {
            fileList = list.split(' ');
            outFile = fileList.pop();
            compressFiles(fileList, outFile).then(() => {
                console.log(chalk.bold.green('done'));
                rl.close();
            });
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
