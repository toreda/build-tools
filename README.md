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
Copyright &copy; 2019 - 2022 Toreda, Inc. All Rights Reserved.

https://www.toreda.com
