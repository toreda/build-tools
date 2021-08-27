import {BuildGulp} from '../../src/build/gulp';
import {Config} from '../../src/config';
import {EventEmitter} from 'events';

describe('BuildGulp', () => {
	let instance: BuildGulp;
	let cfg: Config;
	let events: EventEmitter;

	beforeAll(() => {
		events = new EventEmitter();
		cfg = new Config();
		instance = new BuildGulp(cfg, events);
	});

	describe('Constructor', () => {
		it(`should throw when events arg is undefined`, () => {
			expect(() => {
				const custom = new BuildGulp(cfg, undefined as any);
			}).toThrow('BuildGulp init - events constructor argument missing.');
		});

		it(`should throw when events arg is null`, () => {
			expect(() => {
				const custom = new BuildGulp(cfg, null as any);
			}).toThrow('BuildGulp init - events constructor argument missing.');
		});

		it(`should throw when cfg arg is undefined`, () => {
			expect(() => {
				const custom = new BuildGulp(undefined as any, events);
			}).toThrow('BuildGulp init - cfg constructor argument missing.');
		});

		it(`should throw when cfg arg is null`, () => {
			expect(() => {
				const custom = new BuildGulp(null as any, events);
			}).toThrow('BuildGulp init - cfg constructor argument missing.');
		});
	});
});
