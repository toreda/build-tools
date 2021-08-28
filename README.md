
# `@toreda/build-tools`

![Toreda](https://content.toreda.com/logo/toreda-logo.png)

![CI](https://github.com/toreda/build-tools/workflows/CI/badge.svg?branch=master) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=toreda_build-tools&metric=coverage)](https://sonarcloud.io/dashboard?id=toreda_build-tools) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=toreda_build-tools&metric=alert_status)](https://sonarcloud.io/dashboard?id=toreda_build-tools)



Helpers for common gulp build flows. Reduce complexity and code duplication in your gulpfile. Reduce redundancy and upkeep across multiple projects.

# Contents
* [**Usage**](#usage)

* 	[**Package**](#Package)
	-	[Install](#Install)
	-	[Run Tests](#run-tests)
	-	[Build](#build-from-source)
	-   [License](#license)


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

# Package

## Install
Install `@toreda/build-tools` directly from NPM.

### Install with Yarn (preferred)
```bash
yarn add @toreda/build-tools --dev
```

### Install using NPM
```bash
npm install build-tools --save-dev
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

# License

[MIT](LICENSE) &copy; Toreda, Inc.
