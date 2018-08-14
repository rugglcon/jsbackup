# jsbackup [![Build Status](https://travis-ci.org/travis-ci/travis.rb.svg?branch=master)](https://travis-ci.org/rugglcon/jsbackup)

A backup utility written in pure TypeScript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See Installing for instructions on getting a production ready product.

```
git clone https://github.com/rugglcon/jsbackup
cd jsbackup
npm install
npm test
```

### Prerequisites

`npm` and `nodejs` are the only requirements.

### Installing

Working on publishing to `npm`, however once that's done:

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
npm link
```

Examples:

```shell
# providing files to the program
$ jsbackup file1.txt file2.txt out.tar.gz

# extracting files
$ jsbackup out.tar.gz
```

## Running the tests

[`jest`](https://github.com/facebook/jest) is used to test `jsbackup`. To run the automated test suites, run `npm test`.

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
