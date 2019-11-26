import {
    readdir,
    remove,
    pathExists,
    createFileSync,
    unlinkSync
} from 'fs-extra';
import { dirname } from 'path';
import { compressFiles, extractArchive } from '../src/index';

describe('jsbackup', () => {

    beforeEach(() => {
        process.chdir(dirname(__filename));
    });

    afterEach(async () => {
        const files = await readdir('.');
        files.filter(x => !x.endsWith('spec.ts')).forEach(async z => {
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
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should extract a single tarball', async () => {
        const out = 'test.tar.gz';
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
});
