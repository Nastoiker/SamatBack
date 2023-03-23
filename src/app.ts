import express, { Express } from 'express';
import { Server } from 'http';
import { Ilogger } from './logger/logger.interface';
import { IExceptionFilter } from './errors/exeption.interface';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from './types';
import { UserController } from './user/user.controller';
import { json } from 'body-parser';
import { PrismaService } from './database/prisma.service';
import { IConfigService } from './config/config.service.interface';
import { IUserRepository } from './user/user.repository.interface';
import { AuthMiddleware } from './common/auth.middleware';
import { IProductRepository } from './Product/product.repository.interface';
import { ProductController } from './Product/product.controller';
import { UserAbilityRepository } from './userAbility/userAbility.repository';
import { userAbility } from './userAbility/userAbility.controller';
import cors from 'cors';
import multer from 'multer';
import { AdminController } from './adminAbility/admin.controller';
import { AdminService } from './adminAbility/admin.service';
import { AdminRepository } from './adminAbility/admin.repository';
import { CryptomusService } from './cryptomus/cryptomus.service';
import { CronService } from './cront/cron.service';
import { CronRepository } from './cront/cron.repository';
import { buying } from './buyProduct/buying.controller';
import { MailController } from './Mail/Mail.controller';
@injectable()
export class App {
	server!: Server;
	app: Express;
	port: number;
	constructor(
		@inject(TYPES.LoggerService) private logger: Ilogger,
		@inject(TYPES.ExceptionFilter) private exception: IExceptionFilter,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.ProductRepository) private ProductRepository: IProductRepository,
		@inject(TYPES.ProductController) private productController: ProductController,
		@inject(TYPES.UserAbilityRepository) private userAbilityRepository: UserAbilityRepository,
		@inject(TYPES.userAbility) private UserAbility: userAbility,
		@inject(TYPES.AdminController) private adminController: AdminController,
		@inject(TYPES.AdminService) private adminService: AdminService,
		@inject(TYPES.AdminRepository) private adminRepository: AdminRepository,
		@inject(TYPES.CryptomusService) private cryptomusService: CryptomusService,
		@inject(TYPES.CronService) private cronService: CronService,
		@inject(TYPES.CronRepository) private cronRepository: CronRepository,
		@inject(TYPES.BuyProductController) private buyProductController: buying,
		@inject(TYPES.MailController) private mailController: MailController,
	) {
		this.app = express();
		this.port = 8000;
	}
	public useExceptionFilter(): void {
		this.app.use(this.exception.catch.bind(this.exception));
	}
	public useMiddleWares(): void {
		// const upload = new multer({ dest: './uploads/' });
		this.app.use(json());
		this.app.use(cors());
		this.app.use(express.static('uploads'));
		this.app.use(express.static(__dirname));
		const authMiddleWare = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleWare.execute.bind(authMiddleWare));
	}
	public useRoutes(): void {
		this.app.use('/users', this.userController.router);
		this.app.use('/product', this.productController.router);
		this.app.use('/product', this.UserAbility.router);
		this.app.use('/admin', this.adminController.router);
		this.app.use('/buy', this.buyProductController.router);
		this.app.use('/email', this.mailController.router);
	}
	public async init(): Promise<void> {
		this.useMiddleWares();
		this.useRoutes();
		this.useExceptionFilter();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущен localhost на порту:${this.port}`);
	}
	public async close(): Promise<void> {
		this.server.close();
	}
}
