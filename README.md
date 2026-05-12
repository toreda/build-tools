![Toreda](https://content.toreda.com/logo/toreda-logo.png)

[![CI](https://img.shields.io/github/workflow/status/toreda/build-tools/CI?style=for-the-badge)](https://github.com/toreda/build-tools/actions)
[![Coverage](https://img.shields.io/sonar/coverage/toreda_build-tools?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/activity?graph=coverage&id=toreda_build-tools)
[![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/toreda_build-tools?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge)](https://sonarcloud.io/project/overview?id=toreda_build-tools)

[![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/toreda/build-tools/master?style=for-the-badge)](https://github.com/toreda/build-tools/releases/latest)
[![GitHub Release Date](https://img.shields.io/github/release-date/toreda/build-tools?style=for-the-badge)](https://github.com/toreda/build-tools/releases)
[![GitHub issues](https://img.shields.io/github/issues/toreda/build-tools?style=for-the-badge)](https://github.com/toreda/build-tools/issues)

[![license](https://img.shields.io/github/license/toreda/build-tools?style=for-the-badge)](https://github.com/toreda/build-tools/blob/master/LICENSE)

# `@toreda/build-tools`

Helpers for common gulp build flows. Reduce complexity and code duplication in your gulpfile. Reduce redundancy and upkeep across multiple projects.

&nbsp;

# Contents
* [**Usage**](#usage)

* 	[**Package**](#Package)
	-	[Install](#Install)
	-	[Run Tests](#run-tests)
	-	[Build](#build-from-source)
	-   [License](#license)


&nbsp;

# Usage
## Examples

### `gulpfile.ts` for TypeScript library
```typescript
import {dest, parallel, series, src} from 'gulp';

import {Build} from '@toreda/build-tools';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';

const log = new Log();
const events = new EventEmitter();
const build = new Build({
	env: 'dev',
	log: log,
	events: events
});

function runLint() {

}

function createDist() {
	return build.create.dir('./dist', false);
}

function cleanDist() {
	return build.clean.dir('./dist');
}

function buildSrc() {
	return build.run.typescript('./dist', 'tsconfig.json');
}

exports.default = series(createDist, cleanDist, runLint, buildSrc);
```

### Using `Build`

&nbsp;

# Package

## Install
Install `@toreda/build-tools` directly from NPM.

### Install with Yarn (preferred)
```bash
yarn add @toreda/build-tools --dev
```

### Install using NPM
```bash
npm install @toreda/build-tools --save-dev
```


## Run Tests
Install or clone `@toreda/build-tools` [(see above)](#install).

Our unit tests use [Jest](https://jestjs.io/).

Installing jest is not required after project dependencies are installed ([see above](#install)).
```bash
yarn test
```

# Build from source

The next steps are the same whether you installed the package using NPM or cloned the repo from Github.

### Build with Yarn
 Enter the following commands in order from the build-tools project root.
```bash
yarn build
```

### Build with NPM
 Enter the following commands in order from the build-tools project root.
```bash
npm run-script build
```

&nbsp;
# Legal

## License
[MIT](LICENSE) &copy; Toreda, Inc.

&nbsp;

## Copyright
Copyright &copy; 2019 - 2026 Toreda, Inc. All Rights Reserved.

https://www.toreda.com

## Website

Toreda's website can be found at [toreda.com](https://www.toreda.com)

&nbsp;
## Toreda Open Source Packages
Explore other open source packages by [toreda.com](https://www.toreda.com) designed to support generics and no runtime dependencies:

| Package                                                          | npm                                                                        | Description                                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`@toreda/build-tools`](https://github.com/toreda/build-tools)   | [@toreda/build-tools](https://www.npmjs.com/package/@toreda/build-tools)   | Reusable helpers to simplify webpack and esbuild build pipelines.                                            |
| [`@toreda/cache`](https://github.com/toreda/cache)               | [@toreda/cache](https://www.npmjs.com/package/@toreda/cache)               | Generic TTL-based object caching.                                                                            |
| [`@toreda/fate`](https://github.com/toreda/fate)                 | [@toreda/fate](https://www.npmjs.com/package/@toreda/fate)                 | Typed result wrapper with built-in success, failure, and status context                                      |
| [`@toreda/lifecycle`](https://github.com/toreda/lifecycle)       | [@toreda/lifecycle](https://www.npmjs.com/package/@toreda/lifecycle)       | Phased async hooks for multi-step object flows                                                               |
| [`@toreda/log`](https://github.com/toreda/log)                   | [@toreda/log](https://www.npmjs.com/package/@toreda/log)                   | Zero-dependency logger for browser, Node, and Web Workers with pluggable transports and granular filtering.  |
| [`@toreda/strong-types`](https://github.com/toreda/strong-types) | [@toreda/strong-types](https://www.npmjs.com/package/@toreda/strong-types) | Self-validating types that eliminate boilerplate validation code                                             |
| [`@toreda/time`](https://github.com/toreda/time)                 | [@toreda/time](https://www.npmjs.com/package/@toreda/time)                 | Type-safe time units with built-in conversion, math operations, and input validation.                        |
| [`@toreda/shared-types`](https://github.com/toreda/shared-types)               | [@toreda/shared-types](https://www.npmjs.com/package/@toreda/shared-types)               | Expressive aliases & helpers that clarify code intent.                                                       |
| [`@toreda/verify`](https://github.com/toreda/verify)             | [@toreda/verify](https://www.npmjs.com/package/@toreda/verify)             | Runtime schema and type validation with recursive definitions, custom types, and detailed validation output. |
| [`pixi-slug`](https://github.com/toreda/pixi-slug)             | [pixi-slug](https://www.npmjs.com/package/@toreda/pixi-slug)             | Fast GPU-accelerated vector text for PixiJS. Crisp at any size, rotation, or 3D transform. |