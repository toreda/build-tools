import {LinterFormatterId} from './formatter/id';

/**
 * @category Linter
 */
export interface LinterTarget {
	srcPatterns: string[];
	formatterId?: LinterFormatterId;
	abortOnLimitBreak?: boolean;
}
