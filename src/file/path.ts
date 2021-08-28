/**
 * Get path property from input or a provided FileOptions object.
 * @param input
 * @returns
 *
 * @category Files
 */
export function filePath(input: string): string | null {
	if (!input) {
		return null;
	}

	if (typeof input !== 'string') {
		return null;
	}

	return input;
}
