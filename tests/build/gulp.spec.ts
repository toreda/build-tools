import {BuildGulp} from '../../src/build/gulp';
import {BuildState} from '../../src/build/state';
import {EventEmitter} from 'events';

describe('BuildGulp', () => {
	let instance: BuildGulp;
	let state: BuildState;
	let events: EventEmitter;

	beforeAll(() => {
		events = new EventEmitter();
		state = new BuildState();
		instance = new BuildGulp(state, events);
	});

	describe('Constructor', () => {
		it(`should throw when events arg is undefined`, () => {
			expect(() => {
				const custom = new BuildGulp(state, undefined as any);
			}).toThrow('BuildGulp init - events constructor argument missing.');
		});

		it(`should throw when events arg is null`, () => {
			expect(() => {
				const custom = new BuildGulp(state, null as any);
			}).toThrow('BuildGulp init - events constructor argument missing.');
		});

		it(`should throw when state arg is undefined`, () => {
			expect(() => {
				const custom = new BuildGulp(undefined as any, events);
			}).toThrow('BuildGulp init - events constructor argument missing.');
		});

		it(`should throw when state arg is null`, () => {
			expect(() => {
				const custom = new BuildGulp(null as any, events);
			}).toThrow('BuildGulp init - state constructor argument missing.');
		});
	});
});
