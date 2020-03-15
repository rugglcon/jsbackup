# jsbackup
[![Build Status](https://travis-ci.org/travis-ci/travis.rb.svg?branch=master)](https://travis-ci.org/rugglcon/jsbackup)
[![npm version](https://img.shields.io/npm/v/jsbackup.svg)](https://www.npmjs.com/package/jsbackup)

A backup utility written in pure TypeScript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See Installing for instructions on getting a production ready product.

```
git clone https://github.com/rugglcon/jsbackup
cd jsbackup
npm install
nvm use // this ensures you're always using a supported version of node
npm test
```

### Prerequisites

`nvm`, `npm` and `nodejs` are the only requirements.

### Installing

Install locally from `npm`:

```
npm install jsbackup
```

Install globally from `npm`:

```
npm install -g jsbackup
```

Or install from the cloned repo:

```
npm run dev
```

Examples:

```sh
# providing files to the program
$ jsbackup -c out.tar.gz file1.txt file2.txt

# extracting files
$ jsbackup -x out.tar.gz
```

```typescript
import { compressFiles, extractTarball } from 'jsbackup';

// compresses a list of files
// Promise chaining example
compressFiles('foo.tar.gz', 'foo.txt').then(() => {
    console.log('Compressed files!');
}).catch(err => {
    console.error('Oh no!');
});

// using async/await
await compressFiles('foo.tar.gz', 'foo.txt');

// extracts a tarball
// Promise chaining example
extractTarball('foo.tar.gz').then(() => {
    console.log('Extracted files!');
}).catch(err => {
    console.error('Oh no!');
});

// using async/await
await extractTarball('foo.tar.gz');
```

## Running the tests

[`jest`](https://github.com/facebook/jest) is used to test `jsbackup`. To run the automated test suites, run `npm test`.

## Roadmap

* Support more types of compression (~~`zip`~~, `bz2`, ~~`7z`~~, etc.)
    * Extraction goes along with those
    * **NOTE:** There is no good package to work with 7zip files, so this is being put on the backlog.
* Support extracting to a specific directory
* Support extracting more than 1 file at a time

## Contributing

Don't really have many guidelines yet, just make sure to be descriptive in any issue submissions (i.e. please provide OS, `node` version, `npm` version, and possibly what kind of shell environment you're using. Any other information you could provide would be helpful as well) and remember to run the tests before submitting a PR, and to add tests for any features you might add to the project.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/rugglcon/jsbackup/tags).

## Authors

* **Connor Ruggles**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* the [`tar`](https://npmjs/package/tar) npm package for providing the brunt of the work
* all contributors to Nodejs, npm, TypeScript, VSCode, jest, and all other tools that are used to create projects just like this
