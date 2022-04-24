import type {BuildOptions} from '../src/build/options';
import {CliArgs} from '../src/cli/args';
import {Config} from '../src/config';
import EventEmitter from 'events';
import {Linter} from '../src/linter';
import {LinterTarget} from '../src/linter/target';
import {Log} from '@toreda/log';

describe('Linter', () => {
	let instance: Linter;
	let cfg: Config;
	let events: EventEmitter;
	let args: Partial<CliArgs>;
	let log: Log;
	let options: BuildOptions;

	beforeAll(() => {
		options = {};
		log = new Log();
		args = {};
		events = new EventEmitter();
		cfg = new Config(args, options, log);
		instance = new Linter(cfg, events, log);
	});

	describe('Constructor', () => {
		it(`should set log property to provided cfg constructor arg`, () => {
			const customCfg = new Config(
				{
					debugMode: true,
					env: 'aaa'
				},
				{},
				log
			);
			const custom = new Linter(customCfg, events, log);
			expect(custom.cfg).toStrictEqual(customCfg);
		});
	});

	describe('Implementation', () => {
		describe('assertTarget', () => {
			it(`should throw when tgt arg is undefined`, () => {
				expect(() => {
					instance.assertTarget(undefined as any);
				}).toThrow('linter:tgt:missing');
			});

			it(`should throw when tgt arg is null`, () => {
				expect(() => {
					instance.assertTarget(null as any);
				}).toThrow('linter:tgt:missing');
			});

			it(`should throw when tgt.srcPatterns is undefined`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: undefined as any
					});
				}).toThrow('linter:tgt.srcPatterns:missing');
			});

			it(`should throw when tgt.srcPatterns is null`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: null as any
					});
				}).toThrow('linter:tgt.srcPatterns:missing');
			});

			it(`should throw when tgt.srcPatterns is a truthy non-array`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: 11111 as any
					});
				}).toThrow('linter:tgt.srcPatterns:bad_format');
			});

			it(`should throw when tgt.srcPatterns is a falsy non-array`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: 0 as any
					});
				}).toThrow('linter:tgt.srcPatterns:bad_format');
			});
			it(`should throw when tgt.srcPatterns is a truthy non-array`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: 11111 as any
					});
				}).toThrow('linter:tgt.srcPatterns:bad_format');
			});

			it(`should not throw when tgt arg is valid`, () => {
				expect(() => {
					instance.assertTarget({
						srcPatterns: ['./src/**']
					});
				}).not.toThrow();
			});
		});

		describe('execute', () => {
			it(`should use assertTarget function to validate provided tgt arg`, async () => {
				const tgt: LinterTarget = {
					srcPatterns: ['./src/**.ts']
				};
				const spy = jest.spyOn(instance, 'assertTarget');
				expect(spy).not.toHaveBeenCalled();
				const _result = instance.execute(tgt);

				expect(spy).toHaveBeenCalledTimes(1);
				spy.mockRestore();
			});
		});
	});
});
