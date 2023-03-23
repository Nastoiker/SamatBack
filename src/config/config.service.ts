import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { Ilogger } from '../logger/logger.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
@injectable()
export class ConfigService {
	private readonly _config!: DotenvParseOutput;
	constructor(@inject(TYPES.LoggerService) private loggerService: Ilogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('Не прочитан env файл');
		} else {
			this._config = result.parsed as DotenvParseOutput;
		}
	}
	get<T>(key: string): string {
		return this._config[key];
	}
}
