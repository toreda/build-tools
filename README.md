
# ArmorJS - Build Tools

[![Build Status](https://travis-ci.com/armorjs/build.svg?branch=master)](https://travis-ci.com/armorjs/build) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=armorjs_build&metric=coverage)](https://sonarcloud.io/dashboard?id=armorjs_build)

Helpers for commonly gulp build actions. Reduce code duplication and complexity in your gulpfiles across multiple projects.

## Contents
- [About ArmorJS](#about-armorjs)
- [Installation](#Installation)
- [Usage](#usage)
- [Build](#build)
- [Testing](#testing)
- [License](#license)

## About ArmorJS
ArmorJS solves unique challenges in the enterprise node ecosystem. Auditing projects for security, reliability, and even license compatibility are monumental tasks when a project includes thousands of frequently changing dependencies.

ArmorJS standards:
* Full typescript support.
* Consistent API between releases.
* Extremely small footprint (for webpacking).
* No more than 5 external dependencies (excluding dev dependencies).
* Compatible with web, node, and serverless deployment.
* Thorough test coverage.
* MIT License.

## Install

***With yarn (preferred):***
```yarn add @armorjs/build```

With NPM:
```npm install @armorjs/build```

## Usage

### Library Usage

#### Typescript
```
import { ArmorBuildTools } from '@armorjs/build';
```

#### Node
```
const ArmorBuildTools = require('@armorjs/build');
```

## Build
Build (or rebuild) the build package:

***With Yarn (preferred):***
```
yarn install
yarn build
```

With NPM:
```
npm install
npm run-script build
```

## Testing

This package uses jest for unit testing. Run the following commands from the directory where `@armorjs/build` has been installed.

***With yarn (preferred):***
```
yarn install
yarn test
```

With NPM:
```
npm install
npm run-script test
```

## License
[MIT](LICENSE) &copy; Michael Brich