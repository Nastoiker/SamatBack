import { IMiddleware } from './middlewares.interface';
import { NextFunction, Request, Response } from 'express';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

export class AdminGuard implements IMiddleware {
	private _config: DotenvParseOutput;
	execute(req: Request, res: Response, next: NextFunction): void {
		const result: DotenvConfigOutput = config();
		this._config = result.parsed as DotenvParseOutput;
		if (req.user == this._config['ADMIN_EMAIL']) {
			return next();
		}
		res.status(401).send({ error: 'вы не зашли под админа' });
	}
}
