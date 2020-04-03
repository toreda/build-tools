import { ArmorBuildConfig } from '../src/config';
import { ArmorBuildRun } from '../src/run';
import { EventEmitter } from 'events';

describe("Run", () => {
	let instance: ArmorBuildRun;
	let events: EventEmitter;
	let config: ArmorBuildConfig;

	beforeAll(() => {
		events = new EventEmitter();
		config = new ArmorBuildConfig();
		instance = new ArmorBuildRun(events, config);
	});

	describe("Constructor", () => {
		it("should throw when events argument is missing", () => {
			expect(() => {
				const customInstance = new ArmorBuildRun(undefined as any, config);
			}).toThrow('Armor Build (run) init failed - events argument missing in constructor.');
		});

		it("should throw when config argment is missing", () => {
			expect(() => {
				const customInstance = new ArmorBuildRun(events, undefined as any);
			}).toThrow('Armor Build (run) init failed - config argument missing in constructor.');
		});
	});
});