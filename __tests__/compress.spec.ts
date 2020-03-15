import { readdir, remove, pathExists } from "fs-extra";
import { dirname } from "path";
import { compressFiles } from "../src/compress";
import { ArchiveType } from "../src/utils";

describe('compress', () => {
    beforeEach(() => {
        process.chdir(dirname(__filename));
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
    });

    it('should compress a list of files to .tar.gz', async () => {
        const out = 'app.spec.ts.tar.gz';
        await compressFiles(ArchiveType["tar.gz"], out, 'index.spec.ts');
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
        await remove(out);
    });

    it('should fail if file does not exist', async () => {
        try {
            await compressFiles(ArchiveType["tar.gz"], 'out.tar.gz', 'foo.bar');
        } catch (err) {
            expect(err).toBeDefined();
        }
    });

    it('should compress a list of files to .zip', async () => {
        const out = 'index.spec.ts.zip';
        await compressFiles(ArchiveType.zip, out, 'index.spec.ts');
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
    });

    it('should compress a list of files to .7z', async () => {
        const out = 'index.spec.ts.7z';
        await compressFiles(ArchiveType["7z"], out, 'index.spec.ts');
        const ex = await pathExists(out);
        expect(ex).toBeTruthy();
    });
});