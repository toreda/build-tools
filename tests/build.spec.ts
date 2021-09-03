import {Build} from '../src/build';
import {BuildOptions} from '../src/build/options';
import {EventEmitter} from 'events';
import {Log} from '@toreda/log';

describe('Build', () => {
	let events: EventEmitter;
	let log: Log;
	let instance: Build;

	describe('Constructor', () => {
		log = new Log();
		events = new EventEmitter();
		instance = new Build({
			env: 'prod',
			events: events,
			log: log
		});
	});

	describe('Implementation', () => {
		let options: BuildOptions;

		beforeEach(() => {
			options = {
				env: 'prod',
				events: events,
				log: log
			};
		});

		describe('initLog', () => {
			it(`should make a new log instance options is not provided`, () => {
				const result = instance.initLog();
				expect(result).not.toBeUndefined();
				expect(result instanceof Log).toBe(true);
			});

			it(`should make a new log instance when options.log is not set`, () => {
				options.log = undefined;
				const result = instance.initLog(options);
				expect(result).not.toBeUndefined();
				expect(result instanceof Log).toBe(true);
			});

			it(`should make a new log instance when options.logs is provided but is not a Log instance`, () => {
				options.log = 'bbbbbbb' as any;
				const result = instance.initLog(options);
				expect(result).not.toBeUndefined();
				expect(result instanceof Log).toBe(true);
			});

			it(`should use options.log when provided`, () => {
				const sampleLog = new Log();
				options.log = sampleLog;
				const result = instance.initLog(options);
				expect(result).toEqual(sampleLog);
				expect(result instanceof Log).toBe(true);
			});
		});

		describe('initEvents', () => {
			it(`should make a new log instance options is not provided`, () => {
				const result = instance.initEvents();
				expect(result).not.toBeUndefined();
				expect(result instanceof EventEmitter).toBe(true);
			});

			it(`should make a new events instance when options.events is not set`, () => {
				options.events = undefined;
				const result = instance.initEvents(options);
				expect(result).not.toBeUndefined();
				expect(result instanceof EventEmitter).toBe(true);
			});

			it(`should make a new events instance when options.events is provided but is not an EventEmitter instance`, () => {
				options.events = 'aaaa' as any;
				const result = instance.initEvents(options);
				expect(result).not.toBeUndefined();
				expect(result instanceof EventEmitter).toBe(true);
			});

			it(`should use options.events when provided`, () => {
				const sampleEvents = new EventEmitter();
				options.events = sampleEvents;
				const result = instance.initEvents(options);
				expect(result).toEqual(sampleEvents);
				expect(result instanceof EventEmitter).toBe(true);
			});
		});

		describe('initConfig', () => {
			it(`should set env to prod args.env is prod`, () => {
				const result = instance.initConfig(['a', 'b', 'aaaa']);
			});

			it(`should set env to prod args.env is dev`, () => {
				const result = instance.initConfig(['a', 'b', 'aaaa']);
			});
		});
	});
});
