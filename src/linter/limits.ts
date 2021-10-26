export interface LinterLimits {
	errors: {
		total: number;
		fatal: number;
		fixable: number;
	};
	warn: {
		total: number;
		fixable: number;
	};
}
