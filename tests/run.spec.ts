import {BuildRun} from '../src/run';
import {EventEmitter} from 'events';
import {BuildState} from '../src/state';

describe('BuildRun', () => {
	let instance: BuildRun;
	let events: EventEmitter;
	let state: BuildState;

	beforeAll(() => {
		state = new BuildState();
		events = new EventEmitter();
		instance = new BuildRun(events, state);
	});

	describe('Constructor', () => {
		it('should throw when events argument is missing', () => {
			expect(() => {
				const customInstance = new BuildRun(undefined as any, state);
			}).toThrow('BuildRun init - events arg is missing.');
		});

		it('should throw when state argment is missing', () => {
			expect(() => {
				const customInstance = new BuildRun(events, undefined as any);
			}).toThrow('BuildRun init - state arg is missing.');
		});
	});
});
