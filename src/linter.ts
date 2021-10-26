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
		this.execute = this.execute.bind(this);
	}

	public assertTarget(tgt: LinterTarget): void {
		if (!tgt) {
			throw new Error(`Linter failure - tgt arg is missing.`);
		}

		if (tgt.srcPatterns === undefined || tgt.srcPatterns === null) {
			throw new Error(`Linter failure - srcPatterns arg is missing.`);
		}

		if (!Array.isArray(tgt.srcPatterns)) {
			throw new Error(`Linter failure - srcPatterns arg is not a valid array.`);
		}
	}

	public async execute(tgt: LinterTarget): Promise<LinterSummary> {
		const summary = new LinterSummary();
		const fnLog = this.log.makeLog('execute');
		fnLog.debug('Linter execution started');

		this.assertTarget(tgt);

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
			} else {
				fnLog.error(`Unknown error type thrown during execute call.`);
			}
		}

		fnLog.debug('Linter execution complete.');
		return summary;
	}
}
