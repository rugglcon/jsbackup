import {
    readdir,
    remove,
    pathExists,
    createFileSync,
    unlinkSync
} from 'fs-extra';
import { dirname } from 'path';
import { compressFiles, extractArchive } from '../src/index';
import * as childProcess from 'child_process';

describe('jsbackup', () => {

    beforeEach(() => {
        process.chdir(dirname(__filename));
    });

    afterEach(async () => {
        const files = await readdir('.');
        files.filter(x => !x.endsWith('spec.ts') && !x.includes('test.tar.gz')).forEach(async z => {
            await remove(z);
        });
        await remove('test');
        await remove('../test');
    });

    it('should compress a list of files to .tar.gz', async () => {
        const out = 'app.spec.ts.tar.gz';
        await compressFiles('tar.gz', out, 'index.spec.ts');
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
        await remove(out);
    });

    it('should fail if file does not exist', async () => {
        try {
            await compressFiles('tar.gz', 'out.tar.gz', 'foo.bar');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should extract a single tarball', async () => {
        const out = 'testFile.tar.gz';
        const iN = 'test';
        createFileSync(iN);
        await compressFiles('tar.gz', out, iN);
        unlinkSync(iN);
        await extractArchive('tar.gz', out);
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
        await remove(out);
        await remove(iN);
    });

    it('should compress a list of files to .zip', async () => {
        const out = 'index.spec.ts.zip';
        await compressFiles('zip', out, 'index.spec.ts');
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
        await remove(out);
    });

    it('should extract a single .zip', async () => {
        const out = 'test.zip';
        const iN = 'test';
        createFileSync(iN);
        await compressFiles('zip', out, iN);
        unlinkSync(iN);
        await extractArchive('zip', out);
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
        await remove(out);
        await remove(iN);
    });

    describe('cli', () => {
        let options = {};

        beforeEach(() => options = { cwd: __dirname, shell: true });

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

            it('should compress files', done => {
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

            it('should extract files', done => {
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
        });
    });
});
