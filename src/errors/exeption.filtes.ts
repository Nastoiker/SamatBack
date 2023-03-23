import { IExceptionFilter } from './exeption.interface';
import { Ilogger } from '../logger/logger.interface';
import { HTTPError } from './http-error';
import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private logger: Ilogger) {}
	catch(err: HTTPError | Error, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(err.message);
			res.status(err.statusCode).send({ error: err.message });
		} else {
			this.logger.error(err.message);
			res.status(500).send({ error: err.message });
		}
	}
}
