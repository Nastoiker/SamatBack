import { Ilogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
@injectable()
export class PrismaService {
	client: PrismaClient;
	constructor(@inject(TYPES.LoggerService) private loggerService: Ilogger) {
		this.client = new PrismaClient();
	}
	public async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.loggerService.log('[DB] Успешное подключение к базе данной');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error('Ошибка подключения к бд' + e.message);
			}
		}
	}
	public async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
