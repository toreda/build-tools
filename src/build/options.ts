import {EventEmitter} from 'events';
import {Log} from '@toreda/log';

/**
 * Options used by Build on instantiation to seed initial objects
 * and settings.
 */
export interface BuildOptions {
	events?: EventEmitter;
	env?: string;
	log?: Log;
}
