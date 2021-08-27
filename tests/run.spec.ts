import {Config} from '../src/config';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';
import {Run} from '../src/run';

describe('Run', () => {
	let instance: Run;
	let events: EventEmitter;
	let cfg: Config;
	let log: Log;

	beforeAll(() => {
		log = new Log();
		cfg = new Config();
		events = new EventEmitter();
		instance = new Run(cfg, events, log);
	});

	describe('Constructor', () => {
		let constructorObj: Run;
		beforeAll(() => {
			constructorObj = new Run(cfg, events, log);
		});

		it('should throw when cfg argument is undefined', () => {
			expect(() => {
				const custom = new Run(undefined as any, events, log);
			}).toThrow('Run init - cfg arg missing.');
		});

		it('should throw when cfg argment is missing', () => {
			expect(() => {
				const custom = new Run(undefined as any, events, log);
			}).toThrow('Run init - cfg arg missing.');
		});

		it(`should initialize fileUtils property`, () => {});
	});
});
