import {EventEmitter} from 'events';
import {Log} from '@toreda/log';

export interface BuildOptions {
	events?: EventEmitter;
	env?: string;
	log?: Log;
}
