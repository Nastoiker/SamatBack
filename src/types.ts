import { MailService } from './Mail/Mail.service';
import { CronRepository } from './cront/cron.repository';
import { CryptomusService } from './cryptomus/cryptomus.service';
import { BuyingService } from './buyProduct/buying.service';
import { MailController } from './Mail/Mail.controller';

export const TYPES = {
	Application: Symbol.for('Application'),
	UserService: Symbol.for('UserService'),
	ConfigService: Symbol.for('ConfigService'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	PrismaService: Symbol.for('PrismaService'),
	LoggerService: Symbol.for('LoggerService'),
	UserController: Symbol.for('UserController'),
	UserRepository: Symbol.for('UserRepository'),
	ProductRepository: Symbol.for('ProductRepository'),
	ProductService: Symbol.for('ProductService'),
	ProductController: Symbol.for('ProductController'),
	UserAbilityService: Symbol.for('UserAbilityService'),
	UserAbilityRepository: Symbol.for('UserAbilityRepository'),
	userAbility: Symbol.for('userAbility'),
	FileService: Symbol.for('FileService'),
	FilesController: Symbol.for('FilesController'),
	BuyProductController: Symbol.for('buying'),
	AdminController: Symbol.for('AdminController'),
	AdminService: Symbol.for('AdminService'),
	AdminRepository: Symbol.for('AdminRepository'),
	MailService: Symbol.for('MailService'),
	MailController: Symbol.for('MailController'),
	MailRepository: Symbol.for('MailRepository'),
	CronRepository: Symbol.for('CronRepository'),
	CronService: Symbol.for('CronService'),
	CryptomusService: Symbol.for('CryptomusService'),
	BuyingService: Symbol.for('BuyingService'),
};
