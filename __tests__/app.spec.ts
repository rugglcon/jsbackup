import * as fs from 'fs-extra';
import * as path from 'path';
import { compressFiles } from '../src/app';

describe('jsbackup', () => {
    it('should compress a list of files', () => {
        process.chdir(path.dirname(__filename));
        compressFiles(['app.spec.ts'], 'app.spec.ts.tar.gz').then(() => {
            fs.exists('app.spec.ts.tar.gz', ex => {
                expect(ex).toBeTruthy();
                fs.unlink('app.spec.ts.tar.gz');
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
});
