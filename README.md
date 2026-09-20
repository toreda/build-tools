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

### Transpile to CommonJS, ES modules, or both
Each output format has its own step, and which formats a project builds is the project's call.

| Step | Output |
|---|---|
| `gulpSteps.transpileCjs(options)` | CommonJS in `./dist/cjs`. |
| `gulpSteps.transpileEsm(options)` | ES modules in `./dist/esm`. |
| `gulpSteps.transpile(formats, options)` | Each format key in `formats`, in the order provided. `['cjs', 'esm']` calls `transpileCjs` then `transpileEsm`. |
| `gulpSteps.transpileAll(options)` | Every supported format. |

```typescript
// Both formats, so consumers of your package can use `import` or `require`.
function buildSrc() {
	return build.gulpSteps.transpileAll();
}

// Only the formats you choose.
function buildSrc() {
	return build.gulpSteps.transpile(['esm']);
}

exports.default = series(createDist, cleanDist, runLint, buildSrc);
```

With no options each step reads `./tsconfig.json` and overrides `module` for its format (`commonjs` for CJS, `es2020` for ESM), so one tsconfig builds every format.

Steps then make their output loadable in Node:
* Relative imports in ESM `.js` and `.d.ts` files get file extensions (`'./config'` becomes `'./config.js'`), which Node requires in ES modules.
* Each output dir gets a `package.json` with its module `type`, so Node reads it correctly regardless of the `type` in your root `package.json`.
* When the tsconfig sets `removeComments`, declaration files are emitted again with comments intact so your JSDoc still shows in editors.

When building both formats, point your `package.json` at both outputs:
```json
{
	"main": "./dist/cjs/index.js",
	"module": "./dist/esm/index.js",
	"typings": "./dist/cjs/index.d.ts",
	"exports": {
		".": {
			"import": {
				"types": "./dist/esm/index.d.ts",
				"default": "./dist/esm/index.js"
			},
			"require": {
				"types": "./dist/cjs/index.d.ts",
				"default": "./dist/cjs/index.js"
			}
		},
		"./package.json": "./package.json"
	}
}
```

When building one format, set its dir name to an empty string to write output directly to `outDir`:
```typescript
// ESM only, written to './dist'.
function buildSrc() {
	return build.gulpSteps.transpileEsm({esmDirName: ''});
}
```

### Transpile options
Every default can be changed. All steps take the same options, and all options are optional. Options prefixed with a format key only apply to that format.

| Option | Default | Description |
|---|---|---|
| `outDir` | `./dist` | Root output dir. |
| `cjsDirName` | `cjs` | Name of the CommonJS dir inside `outDir`. Empty string writes to `outDir`. |
| `esmDirName` | `esm` | Name of the ES module dir inside `outDir`. Empty string writes to `outDir`. |
| `tsConfigPath` | `./tsconfig.json` | tsconfig used by formats without their own tsconfig path. |
| `cjsTsConfigPath` | | Separate tsconfig for CommonJS output. When not set, `tsConfigPath` is used with `module` overridden. |
| `esmTsConfigPath` | | Separate tsconfig for ESM output. When not set, `tsConfigPath` is used with `module` overridden. |
| `cjsModule` | `commonjs` | `module` value for CommonJS output when `cjsTsConfigPath` is not set. |
| `esmModule` | `es2020` | `module` value for ESM output when `esmTsConfigPath` is not set. |
| `srcPatterns` | tsconfig `filesGlob`, then `['./src/**/*.ts']` | Glob patterns matching source files to transpile. |
| `cjsCompilerOptions` | | Compiler options applied on top of the tsconfig for CommonJS output. |
| `esmCompilerOptions` | | Compiler options applied on top of the tsconfig for ESM output. |
| `declarationComments` | auto | `true` always emits declarations again with comments, `false` never does. When not set, they are emitted again only when the tsconfig uses `removeComments` or `typesTsConfigPath` is set. |
| `typesTsConfigPath` | tsconfig used by the format | tsconfig used when emitting declarations again. |
| `typesTscArgs` | | Additional `tsc` args used when emitting declarations again. |
| `tscPath` | `typescript` package in the working dir | Path to the `tsc` script. |
| `finalize` | | Controls the fixes applied after transpiling. See below. |

`finalize` options:

| Option | Default | Description |
|---|---|---|
| `rewriteImports` | `true` | Add file extensions to relative imports in ESM output. |
| `packageTypes` | `true` | Write a `package.json` with the module `type` to each output dir. |
| `extMap` | `{'.js': '.js', '.d.ts': '.js'}` | File types to rewrite, mapped to the extension appended to imports found in them. Projects emitting `.mjs` could use `{'.mjs': '.mjs', '.d.mts': '.mjs'}`. |
| `resolvedExts` | `['.js', '.mjs', '.cjs', '.json', '.node']` | Imports already ending in one of these are left unchanged. |
| `indexName` | `index` | Base name of the file a directory import resolves to. |

The pieces used by each step are also exported for pipelines that need a different order or only some of them: `Run.typescript`, `Run.declarations`, `esmFinalize`, `cjsFinalize`, `esmImports`, and `esmSpecifier`.

Source code must itself be valid in every format it is transpiled to. `require()`, `__dirname`, and `__filename` do not exist in ES modules, and named imports from some CommonJS packages fail in Node ESM. Import rewriting covers static imports, re-exports, and `import()` calls with a literal path. It does not cover computed paths or tsconfig `paths` aliases.


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