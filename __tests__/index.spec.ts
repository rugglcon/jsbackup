import * as fs from 'fs-extra';
import * as path from 'path';
import { compressFiles, extractTarball } from '../src/index';

describe('jsbackup', () => {

    beforeEach(() => {
        process.chdir(path.dirname(__filename));
    });

    afterEach(async () => {
        const files = await fs.readdir('.');
        files.filter(x => !x.endsWith('spec.ts')).forEach(async z => {
            await fs.remove(z);
        });
    });

    it('should compress a list of files', async () => {
        const out = 'app.spec.ts.tar.gz';
        await compressFiles(out, 'index.spec.ts');
        const ex = await fs.pathExists(out);
        expect(ex).toBeTruthy();
        await fs.remove(out);
    });

    it('should fail if file does not exist', async () => {
        try {
            await compressFiles('out.tar.gz', 'foo.bar');
            expect(true).toBeFalsy();
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should extract a single tarball', async () => {
        const out = 'test.tar.gz';
        const iN = 'test';
        fs.createFileSync(iN);
        await compressFiles(out, iN);
        fs.unlinkSync(iN);
        await extractTarball(out);
        const ex = await fs.pathExists(out);
        expect(ex).toBeTruthy();
        await fs.remove(out);
        await fs.remove(iN);
    });
});
