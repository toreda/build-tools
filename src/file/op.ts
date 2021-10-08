import {Charset} from '../charset';

/**
 * @category Files
 */
export interface FileOp {
	path?: string;
	encoding?: Charset;
}
