import * as fs from 'fs-extra';
import * as path from 'path';
import { compressFiles, extractTarball } from '../src/app';

describe('jsbackup', () => {
    it('should compress a list of files', () => {
        const out = 'app.spec.ts.tar.gz';
        process.chdir(path.dirname(__filename));
        compressFiles(['app.spec.ts'], out).then(() => {
            fs.exists(out, ex => {
                expect(ex).toBeTruthy();
                fs.unlink(out);
            });
        });
    });

    it('should fail if file does not exist', () => {
        process.chdir(path.dirname(__filename));
        compressFiles(['foo.bar'], 'out.tar.gz').then(() => {
            expect(false).toBeTruthy();
        }).catch(err => {
            expect(err).toBeDefined();
            expect(err.code).toBe('ENOENT');
            fs.unlink('out.tar.gz');
        });
    });

    it('should extract a single tarball', () => {
        const out = 'test.tar.gz';
        const iN = 'test';
        process.chdir(path.dirname(__filename));
        fs.createFileSync(iN);
        compressFiles([iN], out).then(() => {
            fs.unlinkSync(iN);
            extractTarball(out).then(() => {
                fs.exists(out, ex => {
                    expect(ex).toBeTruthy();
                    fs.unlink(out);
                    fs.unlink(iN);
                });
            });
        });
    });
});
