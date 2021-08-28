import {FileOptions} from './options';

/**
 * Get path property from input or a provided FileOptions object.
 * @param input
 * @returns
 *
 * @category Files
 */
export function filePath(input: string | FileOptions): string | null {
	if (!input) {
		return null;
	}

	if (typeof input === 'string') {
		return input;
	}

	if (typeof input.path !== 'string') {
		return null;
	}

	return input.path;
}
