import * as os from 'os';
import * as fs from 'fs';
import * as tar from 'tar';
import * as path from 'path';

// TODO: have this take in arguments for what
// to compress and where to put it, if anywhere
process.chdir(path.join(os.homedir(), 'cur-class'));
const items = fs.readdirSync(process.cwd());
let tars = [];
items.forEach(element => {
    if (fs.lstatSync(element).isDirectory()) {
        let prom = tar.create({
            gzip: true,
            file: `${element}.tar.gz`
        }, [element]);
        console.log('compressing', element);
        tars.push(prom);
    }
});
Promise.all(tars).then(() => console.log('done.'));