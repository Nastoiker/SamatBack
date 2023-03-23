import { inject, injectable } from 'inversify';
import { BaseController } from '../common/base.controller';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IProductService } from '../Product/product.service.interface';
import { UserService } from '../user/user.service';
import { Ilogger } from '../logger/logger.interface';
import { UserAbilityService } from '../userAbility/userAbility.service';
import { AuthGuard } from '../common/Auth.guard';
import { AdminGuard } from '../common/admin.guard';
import { AdminService } from './admin.service';
import { NextFunction, Request, Response } from 'express';
import { ProductCreate } from '../Product/dto/create-product.dto';
import { HTTPError } from '../errors/http-error';

@injectable()
export class AdminController extends BaseController {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ProductService) private productService: IProductService,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.LoggerService) private loggerService: Ilogger,
		@inject(TYPES.UserAbilityService) private userAbilityService: UserAbilityService,
		@inject(TYPES.AdminService) private adminService: AdminService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/deleteModel',
				method: 'post',
				func: this.deleteModel,
				middlewares: [new AdminGuard()],
			},
			{
				path: '/updateTagProduct',
				method: 'post',
				func: this.deleteTagFromProduct,
				middlewares: [new AdminGuard()],
			},
			{
				path: '/deleteComment',
				method: 'post',
				func: this.deleteComment,
				middlewares: [new AdminGuard()],
			},
		]);
	}
	async deleteModel(
		{ body }: Request<{}, {}, { id: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const deleteProduct = await this.adminService.deleteModel(body.id);
		if (!deleteProduct) {
			return next(new HTTPError(401, 'Ошибка создания продукта'));
		}
		this.ok(res, { ...deleteProduct });
	}
	async deleteTagFromProduct(
		{ body }: Request<{}, {}, { productId: string; TagId: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const deleteProduct = await this.adminService.updateTagFromProduct(
			body.productId,
			body.TagId,
		);
		if (!deleteProduct) {
			return next(new HTTPError(401, 'Ошибка обновления тега продукта'));
		}
		this.ok(res, { ...deleteProduct });
	}
	async deleteComment(
		{ body }: Request<{}, {}, { commentId: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const deleteComment = await this.adminService.deleteComment(body.commentId);
		if (!deleteComment) {
			return next(new HTTPError(401, 'Ошибка обновления тега продукта'));
		}
		this.ok(res, { ...deleteComment });
	}
}
