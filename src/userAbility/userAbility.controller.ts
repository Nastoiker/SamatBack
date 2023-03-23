import { BaseController } from '../common/base.controller';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IProductService } from '../Product/product.service.interface';
import { Ilogger } from '../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error';
import { UserService } from '../user/user.service';
import { UserAbilityService } from './userAbility.service';
import { AuthGuard } from '../common/Auth.guard';
import { updateProductToBasketDto } from './dto/update.basket';
import { MFile } from '../files/mfile.class';
import { FileService } from '../files/file.service';
import { MulterMiddleware } from '../common/Multer.middleware';
import { AdminGuard } from '../common/admin.guard';
@injectable()
export class userAbility extends BaseController {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ProductService) private productService: IProductService,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.LoggerService) private loggerService: Ilogger,
		@inject(TYPES.UserAbilityService) private userAbilityService: UserAbilityService,
		@inject(TYPES.FileService) private fileService: FileService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/info:id',
				method: 'post',
				func: this.productBuyUser,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/addBasket',
				method: 'post',
				func: this.addProductToBasket,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/deleteBasket',
				method: 'post',
				func: this.deleteProductToBasket,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/getBasket',
				method: 'get',
				func: this.getBasketUser,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/comment',
				method: 'post',
				func: this.setComment,
				middlewares: [new MulterMiddleware(), new AuthGuard()],
			},
			{
				path: '/setRating',
				method: 'post',
				func: this.setRatingProduct,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/updateBasket',
				method: 'post',
				func: this.updateProductToBasket,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/editQuantityBasketProduct',
				method: 'post',
				func: this.editQuantityBasketProduct,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/deleteComment',
				method: 'post',
				func: this.deleteComment,
				middlewares: [new AuthGuard()],
			},
		]);
	}
	async productBuyUser(
		req: Request<
			{},
			{},
			{ productId: string; title: string; comment: string; pictures: string }
		>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const writtenById = await this.userService.getUserInfo(req.user);
		const productId = await this.productService.find(req.body.productId);
		if (!productId || !writtenById) {
			next(new HTTPError(422, 'не найдены ids'));
		} else {
			const product = {
				...req.body,
				writtenById: writtenById.id,
				modelDeviceId: productId.id,
				pictures: req.body.pictures,
			};
			const result = await this.userAbilityService.setComment(product);
			if (!result) {
				next(new HTTPError(422, 'Ошибка создания коммента '));
			}
			this.ok(res, { mes: 'Ваш комментарий оставлен' });
		}
	}
	async editQuantityBasketProduct(
		req: Request<{}, {}, { basketId: string; quantity: number }>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка добавления товара в корзину'));
		}
		const edited = await this.userAbilityService.editQuantityBasketProduct(
			req.body.basketId,
			req.body.quantity,
		);
		this.ok(res, { edited });
	}
	async addProductToBasket(
		req: Request<{}, {}, { productId: string; quantity: number }>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка добавления товара в корзину'));
		}
		const basket = await this.userAbilityService.addBasket(
			req.body.productId,
			writtenById.id,
			req.body.quantity,
		);
		if (!basket) {
			return next(new HTTPError(422, 'Ошибка добавления товара в корзину'));
		}
		this.ok(res, { ...basket });
	}
	async deleteProductToBasket(
		req: Request<{}, {}, { id: string }>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка регистрации'));
		}
		await this.userAbilityService.deleteBasket(req.body.id);
		this.ok(res, { message: 'deletedBasket' });
	}
	async setComment(
		req: Request<
			{},
			{},
			{
				comment: string;
				modelDeviceId: string;
				title: string;
			}
		>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка создания коммента '));
		}
		if (!req.file) {
			await this.userAbilityService.setComment({
				comment: req.body.comment,
				modelDeviceId: req.body.modelDeviceId,
				writtenById: writtenById.id,
				title: req.body.title,
			});
			return this.ok(res, { message: 'Коммент оставлен' });
		}
		const savearray: MFile[] = [new MFile(req.file)];
		const buffer = await this.fileService.convertToWebp(req.file.buffer);
		savearray.push(
			new MFile({
				originalname: `${req.file.originalname.split('.')[0]}.webp`,
				buffer,
			}),
		);
		await this.userAbilityService.setComment({
			comment: req.body.comment,
			modelDeviceId: req.body.modelDeviceId,
			writtenById: writtenById.id,
			title: req.body.title,
			file: savearray,
		});
		this.ok(res, { message: 'Коммент оставлен' });
	}
	async deleteComment(
		req: Request<{}, {}, { commentId: string }>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка рейтинга '));
		}
		const deleteComment = await this.userAbilityService.deleteComment(req.body.commentId);
		this.ok(res, { message: 'Коммент удален' });
	}
	async setRatingProduct(
		req: Request<{}, {}, { productId: string; quantity: number }>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			return next(new HTTPError(422, 'Ошибка рейтинга '));
		}
		const rating = await this.userAbilityService.setRatingProduct({
			modelDeviceId: req.body.productId,
			writtenById: writtenById.id,
			number: req.body.quantity,
		});
		this.ok(res, { rating });
	}
	async updateProductToBasket(
		req: Request<{}, {}, updateProductToBasketDto>,
		res: Response,
		next: NextFunction,
	) {
		const writtenById = await this.userService.getUserInfo(req.user);
		if (!writtenById) {
			next(new HTTPError(422, 'Ошибка получения корзины '));
		} else {
			const update = await this.userAbilityService.updateProductToBasket(req.body);
			this.ok(res, { update });
		}
	}
	async getBasketUser(req: Request, res: Response, next: NextFunction) {
		const userId = await this.userService.getUserInfo(req.user);
		if (!userId) {
			next(new HTTPError(422, 'Ошибка получения корзины '));
		} else {
			const basket = await this.userAbilityService.getBasketUser(userId.id);
			this.ok(res, basket);
		}
	}
}
