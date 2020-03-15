import { readdir, remove, pathExists } from "fs-extra";
import { dirname } from "path";
import { extractArchive } from "../src/extract";
import { ArchiveType } from "../src/utils";

describe('extract', () => {
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

    it('should extract a single tarball', async () => {
        await extractArchive(ArchiveType["tar.gz"], 'test.tar.gz');
        const ex = await pathExists('LICENSE');
        expect(ex).toBeTruthy();
    });

    it('should extract a single .zip', async () => {
        await extractArchive(ArchiveType.zip, 'test.zip');
        const ex = await pathExists('LICENSE');
        expect(ex).toBeTruthy();
    });

    it('should extract a single .7z', async () => {
        await extractArchive(ArchiveType["7z"], 'test.7z');
        const ex = await pathExists('LICENSE');
        expect(ex).toBeTruthy();
    });
});