import {Config, Create} from '../src';

import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {cliArgsMakeMock} from './_data/cli/args/make/mock';

const events = new EventEmitter();
const log = new Log();
const args = cliArgsMakeMock();
const cfg = new Config(
	args,
	{
		mockAll: true
	},
	log
);

describe('create', () => {
	let instance: Create;

	beforeAll(() => {
		instance = new Create(cfg, events, log);
	});

	describe('folder', () => {
		let dirSpy: jest.SpyInstance;

		beforeAll(() => {
			dirSpy = jest.spyOn(instance, 'dir');
		});

		beforeEach(() => {
			dirSpy.mockClear();
		});

		afterAll(() => {
			dirSpy.mockRestore();
		});

		it(`should call dir with provided path`, async () => {
			expect(dirSpy).not.toHaveBeenCalled();

			const dirName = '10471407140174';
			const result = await instance.folder(dirName);

			expect(dirSpy).toHaveBeenCalledTimes(1);
			expect(dirSpy).toHaveBeenLastCalledWith(dirName, undefined);
		});

		it(`should call dir with provided overwrite flag value (false)`, async () => {
			expect(dirSpy).not.toHaveBeenCalled();
			const dirName = '245972352';
			const result = await instance.folder(dirName, false);

			expect(dirSpy).toHaveBeenCalledTimes(1);
			expect(dirSpy).toHaveBeenLastCalledWith(dirName, false);
		});

		it(`should call dir with provided overwrite flag value (true)`, async () => {
			expect(dirSpy).not.toHaveBeenCalled();
			const dirName = '8i9914919741';
			const result = await instance.folder(dirName, true);

			expect(dirSpy).toHaveBeenCalledTimes(1);
			expect(dirSpy).toHaveBeenLastCalledWith(dirName, true);
		});
	});
});
