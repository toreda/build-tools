/**
 * Options used by various file operations.
 *
 * @category Files
 */
export interface FileOptions {
	/** File encoding charset. */
	encoding?: string;
	/** Is operation recursive? */
	recursive?: boolean;
	/** Target file or dir path when relevant to operation. */
	path?: string;
}
