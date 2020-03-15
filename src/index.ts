#!/usr/bin/env node
import * as yargs from 'yargs';
import { bold } from 'chalk';
import { error, ArchiveType } from './utils';
import { compressFiles } from './compress';
import { extractArchive } from './extract';

async function commandLine(): Promise<void> {
    const argv = yargs
        .usage('Usage: jsbackup -t <tar.gz|zip|7z> <option> [[outfile file1 file2 ...] | [archive]]')
        .example('$0 -t tar.gz -c files.tar.gz file1.txt file2.txt',
            'compresses file1.txt and file2.txt into files.tar.gz')
        .example('$0 -t tar.gz -x files.tar.gz', 'extracts files.tar.gz to files/')
        .boolean('c')
        .boolean('x')
        .string('t')
        .describe('t', 'the type of archive to extract/compress. options are tar.gz, zip, 7z')
        .describe('c', 'compress a list of files')
        .describe('x', 'extract archive')
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
    const acceptableTypes = Object.values(ArchiveType);
    if (compress && extract) {
        error('Cannot have both \'x\' and \'c\'.');
    }

    if (!type || !acceptableTypes.includes(type as ArchiveType)) {
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

if (require.main === module) {
    commandLine();
}
