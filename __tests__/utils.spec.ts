import { readdir, remove } from "fs-extra";
import { dirname } from "path";
import { error, checkExists } from "../src/utils";

describe('utils', () => {
    beforeEach(() => {
        process.chdir(dirname(__filename));
    });

    describe('error', () => {
        it('should throw error with the given string', () => {
            expect(error('error')).toThrowError('error');
        });
    });

    describe('checkExists', () => {
        it('should throw error if path does not exist', () => {
            const file = 'nonexistentfile.txt';
            expect(checkExists(file)).toThrowError(`jsbackup: ${file} does not exist.`);
        });

        it('should not throw error if file exists', () => {
            expect(checkExists(__filename)).not.toThrow();
        });
    })
});