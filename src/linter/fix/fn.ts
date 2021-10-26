import {Linter} from 'eslint';

/**
 * @category Linter
 */
export type LinterFixFn = (message: Linter.LintMessage) => boolean;
