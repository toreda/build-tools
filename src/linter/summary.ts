import {LinterFileResult} from './file/result';
import {LinterLimits} from './limits';
import {LinterTotals} from './totals';

export class LinterSummary {
	public readonly limits: LinterLimits;
	public readonly errors: LinterTotals;
	public readonly warnings: LinterTotals;
	public resultText: string | null;
	public readonly fileResults: LinterFileResult[];
	public errorCode: string;
	public readonly status: {
		success: boolean;
		code: string;
		description: string;
		errors: Error[];
	};

	constructor(limits?: Partial<LinterLimits>) {
		this.errors = this.makeTotals();
		this.warnings = this.makeTotals();
		this.limits = this.makeLimits(limits);

		this.fileResults = [];
		this.resultText = null;
		this.status = {
			success: false,
			errors: [],
			code: '',
			description: ''
		};
	}

	public makeTotals(): LinterTotals {
		return {
			fatal: 0,
			fixable: 0,
			total: 0
		};
	}

	public makeLimits(o?: Partial<LinterLimits>): LinterLimits {
		const limits: LinterLimits = {
			errors: {
				total: 0,
				fixable: 0,
				fatal: 0
			},
			warn: {
				total: 0,
				fixable: 0
			}
		};

		if (o) {
			if (o.errors) {
				if (typeof o.errors.total === 'number') {
					limits.errors.total = o.errors.total;
				}

				if (typeof o.errors.fixable === 'number') {
					limits.errors.fixable = o.errors.fixable;
				}
			}

			if (o.warn) {
				if (typeof o.warn.fixable === 'number') {
					limits.warn.fixable = o.warn.fixable;
				}

				if (typeof o.warn.total === 'number') {
					limits.warn.total = o.warn.total;
				}
			}
		}

		return limits;
	}

	public add(fileResult: LinterFileResult): void {
		if (!fileResult) {
			throw new Error(`Bad linter file result while building summary.`);
		}

		if (typeof fileResult.errorCount === 'number') {
			this.errors.total += fileResult.errorCount;
		}

		if (typeof fileResult.fixableErrorCount === 'number') {
			this.errors.fixable += fileResult.fixableErrorCount;
		}

		if (typeof fileResult.fatalErrorCount === 'number') {
			this.errors.fatal += fileResult.fatalErrorCount;
		}

		if (typeof fileResult.warningCount === 'number') {
			this.warnings.total += fileResult.warningCount;
		}

		if (typeof fileResult.fixableWarningCount === 'number') {
			this.warnings.fixable += fileResult.fixableWarningCount;
		}
	}

	public done(): void {
		if (this.limits.errors.total !== 0 && this.errors.total > this.limits.errors.total) {
			this.status.code = 'ERROR_LIMIT_EXCEEDED';
			this.status.description = `Too many total errors detected. Total error count of '${this.errors.total}' exceeded limit '${this.limits.errors.total}'`;
			this.status.success = false;
			return;
		}

		if (this.errors.fixable !== 0 && this.errors.fixable > this.limits.errors.fixable) {
			this.status.success = false;
			this.status.code = 'FIXABLE_ERROR_LIMIT_EXCEEDED';
			this.status.description = `Too many fixable errors detected. Fixable error count '${this.errors.fixable}' exceeds the configured limit '${this.limits.errors.fixable}'.`;
			return;
		}

		if (this.errors.fatal !== 0 && this.errors.fatal > this.limits.errors.fatal) {
			this.status.success = false;
			this.status.code = 'FATAL_ERROR_LIMIT_EXCEEDED';
			this.status.description = `Too many fatal errors detected. Fatal error count '${this.errors.fatal}' exceeds configured limit '${this.limits.errors.fatal}.`;
			return;
		}

		if (this.warnings.fixable !== 0 && this.warnings.fixable > this.limits.warn.fixable) {
			this.status.success = false;
			this.status.code = 'FIXABLE_WARN_LIMIT_EXCEEDED';
			this.status.description = `Too many fixable warnings detected. Fixable warning count '${this.warnings.fixable}' exceeds configured limit '${this.limits.warn.fixable}'.`;
			return;
		}

		if (this.warnings.total !== 0 && this.warnings.total > this.limits.warn.total) {
			this.status.success = false;
			this.status.code = 'WARN_LIMIT_EXCEEDED';
			this.status.description = `Too many warnings detected. Total warning count '${this.warnings.total}' exceeds configured limit '${this.limits.warn.total}'`;
			return;
		}

		this.status.success = true;
	}
}