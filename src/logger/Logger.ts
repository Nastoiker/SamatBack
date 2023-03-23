import { Logger } from 'tslog';
import { Ilogger } from './logger.interface';
import 'reflect-metadata';
import { injectable } from 'inversify';
@injectable()
export class LoggerService implements Ilogger {
	logger: Logger;
	constructor() {
		this.logger = new Logger({
			displayInstanceName: false,
			displayLoggerName: false,
			displayFilePath: 'hidden',
			displayFunctionName: false,
		});
	}
	log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
	error(...args: unknown[]): void {
		this.logger.error(...args);
	}
}
