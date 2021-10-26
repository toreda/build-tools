import {LinterFileResult} from './file/result';
import {LinterLimits} from './limits';
import {LinterTotals} from './totals';

export class LinterSummary {
	public readonly limits: LinterLimits;
	public readonly errors: LinterTotals;
	public readonly warnings: LinterTotals;
	public resultText: string | null;
	public success: boolean;
	public readonly fileResults: LinterFileResult[];

	constructor(limits?: Partial<LinterLimits>) {
		this.errors = this.makeTotals();
		this.warnings = this.makeTotals();
		this.limits = this.makeLimits(limits);
		this.fileResults = [];
		this.resultText = null;
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
			this.success = false;
			return;
		}

		if (this.errors.fixable !== 0 && this.errors.fixable > this.limits.errors.fixable) {
			this.success = false;
			return;
		}

		if (this.errors.fatal !== 0 && this.errors.fatal > this.limits.errors.fatal) {
			this.success = false;
			return;
		}

		if (this.warnings.fixable !== 0 && this.warnings.fixable > this.limits.warn.fixable) {
			this.success = false;
			return;
		}

		if (this.warnings.total !== 0 && this.warnings.total > this.limits.warn.total) {
			this.success = false;
			return;
		}
	}
}
