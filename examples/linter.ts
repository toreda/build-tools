import {Levels, Log} from '@toreda/log';

import {Build} from '../src/build';

const build = new Build({
	log: new Log({
		globalLevel: Levels.ALL,
		consoleEnabled: true
	})
});

(async (): Promise<void> => {
	await build.linter.execute({
		srcPatterns: ['./examples/file.ts']
	});
})();
