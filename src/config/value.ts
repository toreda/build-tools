import {BuildOptions} from '../build/options';
import {CliArgs} from '../cli/args';

/**
 * Get config key from args and check type, then from options when no match is found.
 * @param key			keyname of property to search for in CliArgs and BuildOptions.
 * @param type			JavaScript type name used to validate value.
 * @param args			CliArgs object to check.
 * @param options		BuildOptions object to check.
 * @returns				T		-	Key value of type T when match is found.
 *						null	-	No key values were found matching type.
 *
 * @category Config
 */
export function configValue<T>(key: string, fallback: T, args?: CliArgs, options?: BuildOptions): T {
	if (typeof key !== 'string' || !key) {
		return fallback;
	}

	const type = typeof fallback;

	if (args && typeof args[key] === type) {
		// Safe cast when typeof fallback matches T.
		return args[key] as T;
	}

	if (options && typeof options[key] === type) {
		// Safe cast when typeof fallback matches T.
		return options[key] as T;
	}

	return fallback;
}
