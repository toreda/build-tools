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
	/** Used by write operations to decide if the process failed when target
	 *  destination already exists.  */
	overwrite?: boolean;
}
