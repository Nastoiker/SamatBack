import { BaseController } from '../common/base.controller';
import { Ilogger } from '../logger/logger.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IUserController } from './user.interface';
import { TYPES } from '../types';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';
import { HTTPError } from '../errors/http-error';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { AuthGuard } from '../common/Auth.guard';
import { OAuth2Client } from 'google-auth-library';
import { MulterMiddleware } from '../common/Multer.middleware';
import { MFile } from '../files/mfile.class';
import { FileService } from '../files/file.service';
import { MailService } from '../Mail/Mail.service';
import { UserModel } from '@prisma/client';
import {UserAdressDto} from "./dto/user-adress.dto";
import {UserEditProfileDto} from "./dto/user-editProfile.dto";

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.LoggerService) private loggerService: Ilogger,
		@inject(TYPES.UserService) private userService: UserService,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.FileService) private fileService: FileService,
		@inject(TYPES.MailService) private emailService: MailService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/verify:id',
				method: 'get',
				func: this.verifyEmail,
				middlewares: [],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/profile:id',
				method: 'get',
				func: this.profileInfo,
				middlewares: [],
			},
			{
				path: '/updateAvatar',
				method: 'post',
				func: this.updateAvatar,
				middlewares: [new AuthGuard(), new MulterMiddleware()],
			},
			{
				path: '/acc:id',
				method: 'get',
				func: this.acc,
				middlewares: [],
			},
			{
				path: '/authorAuthorization',
				method: 'get',
				func: this.authorAuthorization,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/editAddress',
				method: 'post',
				func: this.editAddress,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/createAddress',
				method: 'post',
				func: this.createAddress,
				middlewares: [new AuthGuard()],
			},
			{
				path: '/editProfileInfo',
				method: 'post',
				func: this.editProfileInfo,
				middlewares: [new AuthGuard()],
			},
		]);
	}
	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			next(new HTTPError(422, 'Ошибка создания пользователя '));
		} else {
			this.ok(res, { email: result?.email, id: result?.id });
			await this.emailService.sendActivateEmail(result?.email, result.id);
		}
	}
	async verifyEmail(request: Request, res: Response, next: NextFunction) {
		const getInfoProfile = await this.userService.verifyEmail(request.params['id'].slice(1));
		this.ok(res, { ...getInfoProfile });
	}
	async loginByGoogle(
		{ body }: Request<{}, {}, { CLIENT_ID: string; token: string }>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const client = new OAuth2Client(body.CLIENT_ID);

		const ticket = await client.verifyIdToken({
			idToken: body.token,
			audience: body.CLIENT_ID,
		});
		const payload = ticket.getPayload();
		if (!payload) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const email = payload['email'];
		const jwt = await this.jwtSign(email ?? '', this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}
	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const checkDbUser = await this.userService.validateUser(body);
		if (!checkDbUser) {
			return next(new HTTPError(401, 'ошибка авторизации', 'login'));
		}
		const userModel = (await this.userService.getUserInfo(body.email)) as UserModel;
		if (!userModel.isActive) {
			await this.emailService.sendActivateEmail(userModel.email, userModel.id);
			return next(new HTTPError(401, 'подтвердите почту', 'login'));
		}
		const jwt = await this.jwtSign(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}
	public async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const userModel = await this.userService.getUserInfo(user).then((result) => {
			if (result) {
				const { hashpassword, ...userInfo } = result;
				this.ok(res, { ...userInfo });
			}
		});
	}
	public async acc(request: Request, res: Response, next: NextFunction): Promise<void> {
		const getInfoProfile = await this.userService.getProfileInfoById(
			request.params['id'].slice(1),
		);
		this.ok(res, { ...getInfoProfile });
	}
	public async profileInfo(request: Request, res: Response, next: NextFunction): Promise<void> {
		const getInfoProfile = await this.userService.getProfileInfo(request.params['id'].slice(1));
		this.ok(res, { ...getInfoProfile });
	}
	public async jwtSign(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err: Error | null, token: string | undefined) => {
					if (err) {
						reject();
					}
					resolve(token as string);
				},
			);
		});
	}
	public async editAddress(
		request: Request<{}, {}, UserAdressDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userId = await this.userService.getUserInfo(request.user);
		if (!userId) {
			return next(new HTTPError(401, 'Файл должен быть фотографией'));
		}
		request.body.userId = userId.id;
		const address = await this.userService.editAddress(request.body);
		this.ok(res, { address });
	}
	public async createAddress(
		request: Request<{}, {}, UserAdressDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const userId = await this.userService.getUserInfo(request.user);
		if (!userId) {
			return next(new HTTPError(401, 'Файл должен быть фотографией'));
		}
		request.body.userId = userId.id;
		const address = await this.userService.createAddress(request.body);
		this.ok(res, { address });
	}
	public async updateAvatar(request: Request, res: Response, next: NextFunction): Promise<void> {
		const writtenById = await this.userService.getUserInfo(request.user);
		if (request.file) {
			if (!request.file.mimetype.includes('image')) {
				return next(new HTTPError(401, 'Файл должен быть фотографией'));
			}
			const buffer = await this.fileService.convertToWebp(request.file.buffer);
			const file = new MFile({
				originalname: `${request.file.originalname.split('.')[0]}.webp`,
				buffer,
			});
			const upload = await this.userService.saveAvatar(file, writtenById!.id);
			if (!upload) {
				return next(new HTTPError(401, 'Ошибка добавления аватара'));
			}
			this.ok(res, { mess: 'фото было обновлено с id', id: request.file.originalname });
		} else {
			return next(new HTTPError(401, 'Ошибка фото'));
		}
	}
	public async authorAuthorization(
		request: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const writtenById = await this.userService.getUserInfo(request.user);
		if (!writtenById) {
			return next(new HTTPError(401, 'Ошибка входа'));
		}
		const { hashpassword, ...user } = writtenById;
		this.ok(res, { ...user });
	}
	public async editProfileInfo(
		request: Request<{}, {}, UserEditProfileDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const writtenById = await this.userService.getUserInfo(request.user);
		if (!writtenById) {
			return next(new HTTPError(401, 'Ошибка входа'));
		}
		const result = await this.userService.editProfileInfo(
			writtenById.email,
			request.body,
			writtenById.id,
		);
		if (!result) return next(new HTTPError(401, 'Ошибка редактирования'));
		this.ok(res, { ...result });
	}
}
