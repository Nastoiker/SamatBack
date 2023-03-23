import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middlewares.interface';

export interface IRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'delete' | 'put'>;
	middlewares?: IMiddleware[];
}
export type OutInterface = Response<any, Record<string, any>>;
