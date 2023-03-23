import { IMiddleware } from './middlewares.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

interface JwtPayload {
	email: string;
}
export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			try {
				const { email } = verify(
					req.headers.authorization.split(' ')[1],
					this.secret,
				) as JwtPayload;
				req.user = email.toString();
				next();
			} catch {
				next();
			}
		} else next();
	}
}
