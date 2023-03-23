import { App } from './app';
import { LoggerService } from './logger/Logger';
import { ExceptionFilter } from './errors/exeption.filtes';
import { Container, ContainerModule, interfaces } from 'inversify';
import { Ilogger } from './logger/logger.interface';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exeption.interface';
import { IUserController } from './user/user.interface';
import { UserController } from './user/user.controller';
import { IBootstrap } from './main.interfaces';
import { UserService } from './user/user.service';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IUserRepository } from './user/user.repository.interface';
import { UserRepository } from './user/user.repository';
import { IProductController } from './Product/product.controller.interface';
import { ProductController } from './Product/product.controller';
import { IProductRepository } from './Product/product.repository.interface';
import { ProductRepository } from './Product/product.repository';
import { ProductService } from './Product/product.service';
import { IProductService } from './Product/product.service.interface';
import { userAbility } from './userAbility/userAbility.controller';
import { UserAbilityService } from './userAbility/userAbility.service';
import { UserAbilityRepository } from './userAbility/userAbility.repository';
import { FileService } from './files/file.service';
import { AdminService } from './adminAbility/admin.service';
import { AdminRepository } from './adminAbility/admin.repository';
import { AdminController } from './adminAbility/admin.controller';
import { MailService } from './Mail/Mail.service';
import { CryptomusService } from './cryptomus/cryptomus.service';
import { CronService } from './cront/cron.service';
import { CronRepository } from './cront/cron.repository';
import { BuyingService } from './buyProduct/buying.service';
import { buying } from './buyProduct/buying.controller';
import { MailController } from './Mail/Mail.controller';
import { MailRepository } from './Mail/Mail.repository';

const appContainerBinding = new ContainerModule((bind: interfaces.Bind) => {
	bind<Ilogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
	bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
	bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository).inSingletonScope();
	bind<IProductController>(TYPES.ProductController).to(ProductController).inSingletonScope();
	bind<IProductService>(TYPES.ProductService).to(ProductService).inSingletonScope();
	bind<userAbility>(TYPES.userAbility).to(userAbility).inSingletonScope();
	bind<UserAbilityService>(TYPES.UserAbilityService).to(UserAbilityService).inSingletonScope();
	bind<UserAbilityRepository>(TYPES.UserAbilityRepository)
		.to(UserAbilityRepository)
		.inSingletonScope();
	bind<FileService>(TYPES.FileService).to(FileService).inSingletonScope();
	bind<AdminService>(TYPES.AdminService).to(AdminService).inSingletonScope();
	bind<AdminRepository>(TYPES.AdminRepository).to(AdminRepository).inSingletonScope();
	bind<AdminController>(TYPES.AdminController).to(AdminController).inSingletonScope();
	bind<MailService>(TYPES.MailService).to(MailService).inSingletonScope();
	bind<MailController>(TYPES.MailController).to(MailController).inSingletonScope();
	bind<CryptomusService>(TYPES.CryptomusService).to(CryptomusService).inSingletonScope();
	bind<CronService>(TYPES.CronService).to(CronService).inSingletonScope();
	bind<CronRepository>(TYPES.CronRepository).to(CronRepository).inSingletonScope();
	bind<buying>(TYPES.BuyProductController).to(buying).inSingletonScope();
	bind<BuyingService>(TYPES.BuyingService).to(BuyingService).inSingletonScope();
	bind<MailRepository>(TYPES.MailRepository).to(MailRepository).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

async function bootstrap(): Promise<IBootstrap> {
	const appContainer = new Container();
	appContainer.load(appContainerBinding);
	const app = appContainer.get<App>(TYPES.Application);
	await app.init();
	return { appContainer, app };
}
export const boot = bootstrap();
