import { Response, Router } from 'express';
import { Ilogger } from '../logger/logger.interface';
import { IRoute, OutInterface } from './route.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	constructor(@inject(TYPES.LoggerService) private logger: Ilogger) {
		this._router = Router();
	}
	get router(): Router {
		return this._router;
	}
	public send<T>(res: Response, code: number, msg: T): OutInterface {
		res.type('application/json');
		return res.status(code).json(msg);
	}
	public ok<T>(res: Response, msg: T): OutInterface {
		res.type('application/json');
		return this.send(res, 200, msg);
	}
	public arr<T>(res: Response, msg: T): OutInterface {
		// const arr = msg.map((e) => );
		return res.type('json').send(msg);
	}
	public bindRoutes(routes: IRoute[]): void {
		for (const route of routes) {
			this.logger.log(`${route.method}, ${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
