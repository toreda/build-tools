/**
 *
 *
 * @category TypeScript
 */
export interface TranspileOptions {
	/** Path to tsconfig.json.
	 * 	Uses './tsconfig.json' by default when not defined. */
	tsConfigFilePath?: string;
	/** Path to dir containing tsconfig.json. */
	tsConfigDirPath?: string;
}
