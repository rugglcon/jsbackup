import {
    readdir,
    remove,
    pathExists
} from 'fs-extra';
import { dirname } from 'path';
import * as childProcess from 'child_process';

describe('jsbackup', () => {
    let options = {};

    beforeEach(() => {
        process.chdir(dirname(__filename));
        options = { cwd: __dirname, shell: true }
    });

    afterEach(async () => {
        const files = await readdir('.');
        files.filter(x => {
            return !x.endsWith('spec.ts') &&
                    !x.includes('test.tar.gz') &&
                    !x.includes('test.zip') &&
                    !x.includes('test.7z');
        }).forEach(async z => {
            await remove(z);
        });
        await remove('../test');
    });

    it('should fail if both compress and extract are provided', done => {
        let err = '';
        const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'f', '-c', 'f', '-t', 'f'], options);
        child.stderr.on('data', chunk => err += chunk);
        child.on('close', () => {
            expect(err).toContain('Cannot have both \'x\' and \'c\'.');
            done();
        });
    });

    it('should fail if invalid type', done => {
        let err = '';
        const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'f', '-t', 'f'], options);
        child.stderr.on('data', chunk => err += chunk);
        child.on('close', () => {
            expect(err).toContain('You must give a valid type. Type given: f.');
            done();
        });
    });

    describe('compress', () => {
        it('should fail if no arguments', done => {
            let err = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-c', '-t', 'tar.gz'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.on('close', () => {
                expect(err).toContain('Not enough non-option arguments: got 0, need at least 1');
                done();
            });
        });

        it('should fail if one argument', done => {
            let err = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-c', 'f', '-t', 'tar.gz'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.on('close', () => {
                expect(err).toContain('Need at least 2 arguments for compression; receieved 1');
                done();
            });
        });

        it('should compress files to tar', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-c', 'file.tar.gz', __filename, '-t', 'tar.gz'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('file.tar.gz');
                expect(exists).toBeTruthy();
                done();
            });
        });

        it('should compress files to zip', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-c', 'file.zip', __filename, '-t', 'zip'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('file.zip');
                expect(exists).toBeTruthy();
                done();
            });
        });

        it('should compress files to 7z', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-c', 'file.7z', __filename, '-t', '7z'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('file.7z');
                expect(exists).toBeTruthy();
                done();
            });
        });
    });

    describe('extract', () => {
        it('should fail if too many arguments', done => {
            let err = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'f', 'd', '-t', 'tar.gz'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.on('close', () => {
                expect(err).toContain('Can only have one argument for extraction but receieved 2');
                done();
            });
        });

        it('should extract tarball', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'test.tar.gz', '-t', 'tar.gz'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('LICENSE');
                expect(exists).toBeTruthy();
                done();
            });
        });

        it('should extract zip', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'test.zip', '-t', 'zip'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('LICENSE');
                expect(exists).toBeTruthy();
                done();
            });
        });

        it('should extract 7z', done => {
            let err = '';
            let out = '';
            const child = childProcess.spawn('node', ['../dist/index.js', '-x', 'test.7z', '-t', '7z'], options);
            child.stderr.on('data', chunk => err += chunk);
            child.stdout.on('data', chunk => out += chunk);
            child.on('close', async () => {
                expect(err).toBe('');
                expect(out).toContain('done');
                const exists = await pathExists('LICENSE');
                expect(exists).toBeTruthy();
                done();
            });
        });
    });
});
