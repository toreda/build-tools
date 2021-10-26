import {Config} from './config';
import {ESLint} from 'eslint';
import {EventEmitter} from 'stream';
import {LinterSummary} from './linter/summary';
import {LinterTarget} from './linter/target';
import {Log} from '@toreda/log';

/**
 * @category Linter
 */
export class Linter {
	public readonly _eslint: ESLint;
	public readonly log: Log;
	public readonly cfg: Config;
	public readonly events: EventEmitter;

	constructor(cfg: Config, events: EventEmitter, log: Log) {
		this.log = log.makeLog('Linter');
		this.cfg = cfg;
		this.events = events;

		this._eslint = new ESLint(cfg.linter.eslintOptions());
	}

	public async execute(tgt: LinterTarget): Promise<LinterSummary> {
		const summary = new LinterSummary();
		const fnLog = this.log.makeLog('execute');

		try {
			const results = await this._eslint.lintFiles(tgt.srcPatterns);
			const formatterId = typeof tgt?.formatterId === 'string' ? tgt?.formatterId : 'stylish';
			const formatter = await this._eslint.loadFormatter(formatterId);

			const resultText = formatter.format(results);

			summary.resultText = resultText;
			for (const result of results) {
				summary.add(result);
			}

			fnLog.info(resultText);
			summary.done();
		} catch (e: unknown) {
			if (e instanceof Error) {
				fnLog.error(e.message);
			}
		}

		if (tgt.abortOnLimitBreak === true && !summary.success) {
			fnLog.error(`Linter scan exceeded the configured error or warning limits.`);
			throw new Error(`Linter scan exceeded configured error or warning limits.`);
		}

		return summary;
	}
}
