import type {LinterFileResult} from '../../src/linter/file/result';
import type {LinterLimits} from '../../src/linter/limits';
import {LinterSummary} from '../../src/linter/summary';
import type {LinterTotals} from '../../src/linter/totals';

const EMPTY_ARRAY = [];
const EMPTY_STRING = '';

describe('LinterSummary', () => {
	let instance: LinterSummary;

	beforeAll(() => {
		instance = new LinterSummary();
	});

	beforeEach(() => {
		instance.errors.fatal = 0;
		instance.errors.fixable = 0;
		instance.errors.total = 0;

		instance.limits.errors.fatal = 0;
		instance.limits.errors.fixable = 0;
		instance.limits.errors.total = 0;

		instance.warnings.fatal = 0;
		instance.warnings.fixable = 0;
		instance.warnings.total = 0;
		instance.limits.warn.fixable = 0;
		instance.limits.warn.total = 0;
	});

	describe('Constructor', () => {
		let ctorInstance: LinterSummary;

		beforeAll(() => {
			ctorInstance = new LinterSummary();
		});

		describe('summary.status', () => {
			it(`should initialize summary.status`, () => {
				expect(ctorInstance.status).not.toBeUndefined();
			});

			it(`should initialize summary.status.success to false`, () => {
				expect(ctorInstance.status).not.toBeUndefined();
				expect(ctorInstance.status.success).toBe(false);
			});

			it(`should initialize summary.status.errors to an empty array`, () => {
				expect(ctorInstance.status).not.toBeUndefined();
				expect(ctorInstance.status.errors).toStrictEqual(EMPTY_ARRAY);
			});

			it(`should initialize summary.status.code to an empty string`, () => {
				expect(ctorInstance.status).not.toBeUndefined();
				expect(ctorInstance.status.code).toBe(EMPTY_STRING);
			});

			it(`should initialize summary.status.description to an empty string`, () => {
				expect(ctorInstance.status).not.toBeUndefined();
				expect(ctorInstance.status.description).toBe(EMPTY_STRING);
			});
		});

		describe('summary.errors', () => {
			it(`should initialize summary.errors.fatal to 0`, () => {
				expect(ctorInstance.errors.fatal).toBe(0);
			});

			it(`should initialize summary.errors.fixable to 0`, () => {
				expect(ctorInstance.errors.fixable).toBe(0);
			});

			it(`should initialize summary.errors.total to 0`, () => {
				expect(ctorInstance.errors.total).toBe(0);
			});
		});

		describe('summary.warnings', () => {
			it(`should initialize summary.warnings.fatal to 0`, () => {
				expect(ctorInstance.warnings.fatal).toBe(0);
			});

			it(`should initialize summary.warnings.fixable to 0`, () => {
				expect(ctorInstance.warnings.fixable).toBe(0);
			});

			it(`should initialize summary.warnings.total to 0`, () => {
				expect(ctorInstance.warnings.total).toBe(0);
			});
		});

		describe('summary.limits', () => {
			it(`should initialize summary.limits.errors.total to 0`, () => {
				expect(ctorInstance.limits.errors.total).toBe(0);
			});

			it(`should initialize summary.limits.errors.fixable to 0`, () => {
				expect(ctorInstance.limits.errors.fixable).toBe(0);
			});

			it(`should initialize summary.limits.errors.fatal to 0`, () => {
				expect(ctorInstance.limits.errors.fatal).toBe(0);
			});

			it(`should override default error total when o.errors.total is provided`, () => {
				const value = 199;
				const custom = new LinterSummary({
					errors: {
						fatal: 154,
						fixable: 155,
						total: value
					}
				});

				expect(custom.limits.errors.total).toBe(value);
			});

			it(`should override default fatal error limit when o.errors.fatal is provided`, () => {
				const value = 241;
				const custom = new LinterSummary({
					errors: {
						fatal: value,
						fixable: 155,
						total: 1551
					}
				});

				expect(custom.limits.errors.fatal).toBe(value);
			});

			it(`should override default fixable error limit when o.errors.fixable is provided`, () => {
				const value = 2411;
				const custom = new LinterSummary({
					errors: {
						fatal: 154,
						fixable: value,
						total: 71714
					}
				});

				expect(custom.limits.errors.fixable).toBe(value);
			});

			it(`should override default fixable warning limit when o.warn.fixable is provided`, () => {
				const value = 4414;
				const custom = new LinterSummary({
					warn: {
						fixable: value,
						total: 1551
					}
				});

				expect(custom.limits.warn.fixable).toBe(value);
			});

			it(`should override default total warn limit when o.warn.total is provided`, () => {
				const value = 33331145;
				const custom = new LinterSummary({
					warn: {
						fixable: 881,
						total: value
					}
				});

				expect(custom.limits.warn.total).toBe(value);
			});
		});
	});

	describe('Implementation', () => {
		describe('add', () => {
			let linterResult: Partial<LinterFileResult>;
			beforeEach(() => {
				linterResult = {
					errorCount: 0,
					fixableErrorCount: 0,
					fixableWarningCount: 0,
					messages: [],
					warningCount: 0
				};
			});

			it(`should throw when file result arg is undefined`, () => {
				expect(() => {
					instance.add(undefined as any);
				}).toThrow('add:result:arg:missing');
			});

			it(`should throw when file result arg is null`, () => {
				expect(() => {
					instance.add(null as any);
				}).toThrow('add:result:arg:missing');
			});

			it(`should add to errorCount when result.errorCount is a number`, () => {
				expect(instance.errors.total).toBe(0);
				const value = 371;
				const maxRuns = 4;
				const fileResult: Partial<LinterFileResult> = {
					errorCount: value
				};

				for (let i = 0; i < maxRuns - 1; i++) {
					instance.add(fileResult);
					expect(instance.errors.total).toBe(i * value + value);
				}
			});

			it(`should add to errrs.fatal when result.fatalErrorCount is a number`, () => {
				expect(instance.errors.fatal).toBe(0);
				const value = 4991;
				const maxRuns = 4;
				const fileResult: Partial<LinterFileResult> = {
					fatalErrorCount: value
				};

				for (let i = 0; i < maxRuns - 1; i++) {
					instance.add(fileResult);
					expect(instance.errors.fatal).toBe(i * value + value);
				}
			});

			it(`should add to errrs.fixable when result.fixableErrorCount is a number`, () => {
				expect(instance.errors.fixable).toBe(0);
				const value = 809;
				const maxRuns = 4;
				const fileResult: Partial<LinterFileResult> = {
					fixableErrorCount: value
				};

				for (let i = 0; i < maxRuns - 1; i++) {
					instance.add(fileResult);
					expect(instance.errors.fixable).toBe(i * value + value);
				}
			});

			it(`should add to warnings.total when result.warningCount is a number`, () => {
				expect(instance.warnings.total).toBe(0);
				const value = 541;
				const maxRuns = 4;
				const fileResult: Partial<LinterFileResult> = {
					warningCount: value
				};

				for (let i = 0; i < maxRuns - 1; i++) {
					instance.add(fileResult);
					expect(instance.warnings.total).toBe(i * value + value);
				}
			});

			it(`should add to warnings.fixable when result.fixableWarningCount is a number`, () => {
				expect(instance.warnings.fixable).toBe(0);
				const value = 301;
				const maxRuns = 4;
				const fileResult: Partial<LinterFileResult> = {
					fixableWarningCount: value
				};

				for (let i = 0; i < maxRuns - 1; i++) {
					instance.add(fileResult);
					expect(instance.warnings.total).toBe(i * value + value);
				}
			});
		});

		describe('done', () => {
			it(`should set error code to 'ERROR_LIMIT_EXCEEDED' when error toal exceeds allowed limit`, () => {
				const value = 9991011;
				const limit = 99102;
				const custom = new LinterSummary({
					errors: {
						fatal: 0,
						fixable: 0,
						total: limit
					}
				});

				expect(custom.status.code).toBe(EMPTY_STRING);
				expect(custom.status.success).toBe(false);
				custom.errors.fatal = value;
				custom.done();

				expect(custom.status.code).toBe('FATAL_ERROR_LIMIT_EXCEEDED');
				expect(custom.status.success).toBe(false);
			});

			it(`should set error code to 'ERROR_LIMIT_EXCEEDED' when error toal exceeds allowed limit`, () => {
				const value = 4286186;
				const limit = 88;
				const custom = new LinterSummary({
					errors: {
						fatal: 0,
						fixable: 0,
						total: limit
					}
				});

				expect(custom.status.code).toBe(EMPTY_STRING);
				expect(custom.status.success).toBe(false);
				custom.errors.fixable = value;
				custom.done();

				expect(custom.status.code).toBe('FIXABLE_ERROR_LIMIT_EXCEEDED');
				expect(custom.status.success).toBe(false);
			});
		});
	});
});
