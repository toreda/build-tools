import {Charset} from '../charset';

export interface FileOp {
	path?: string;
	encoding?: Charset;
}
