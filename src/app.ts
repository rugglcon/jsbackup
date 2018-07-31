import * as os from 'os';
import * as fs from 'fs';
import * as tar from 'tar';
import * as path from 'path';

tar.create({
    gzip: true,
    file: 'out.tar.gz'
}, [path.join(os.homedir(), '.vim/vimrc')])
.then(() => {
    return tar.extract({
        file: 'out.tar.gz'
    });
})
.then(() => {
    console.log('yay');
});