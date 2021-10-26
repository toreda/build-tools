import {ESLint} from 'eslint';
import {LinterFormatterId} from './formatter/id';

/**
 * @category Linter
 */
export interface LinterOptions extends ESLint.Options {
	quiet?: boolean;
	formatterId?: LinterFormatterId;
	eslint?: ESLint.Options;
	autofix?: boolean;
}
