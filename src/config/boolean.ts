import {BuildOptions} from '../build/options';
import {CliArgs} from '../cli/args';
import {configValue} from './value';

/**
 * Alias for configValue with boolean generic type.
 * @param key
 * @param fallback
 * @param args
 * @param options
 * @returns
 *
 * @category Config
 */
export function configBoolean(
	key: string,
	fallback: boolean,
	args?: CliArgs,
	options?: BuildOptions
): boolean {
	return configValue<boolean>(key, fallback, args, options);
}
