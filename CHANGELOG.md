# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2021-12-12

### Added
* Latest NPM dependencies
* `glob-parent` `^5.1.2` and `ansi-regex` `^5.0.1` to yarn resolutions due to CVE flagged by Github during build.

## [0.4.1] - 2021-10-23
* Upgraded all dependencies to latest versions. Specific `eslint` and `gulp-eslint` versions are causing conflicts for some packages. The version conflicts are not related to this package, but are solved by temporarrily adding `resolutions` for `eslint` and `lodash`.

[Unreleased]: https://github.com/toreda/build-tools/compare/v0.4.1...HEAD
[0.6.0]: https://github.com/toreda/build-tools/compare/v0.4.1...v0.6.0
[0.4.1]: https://github.com/toreda/build-tools/releases/tag/v0.4.1
