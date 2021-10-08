import {BuildMode} from '../mode';

/**
 * Iterate set containing all valid BuildMode values.
 *
 * @category Config
 */
export const buildModeSet = new Set<BuildMode>(['dev', 'prod', 'debug']);
