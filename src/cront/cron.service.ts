import { ICronService } from './cront.service.interface';
import { inject, injectable } from 'inversify';
import { CronRepository } from './cron.repository';
import { TYPES } from '../types';
import { CryptomusService } from '../cryptomus/cryptomus.service';
import cron from 'node-cron';
@injectable()
export class CronService implements ICronService {
	constructor(
		@inject(TYPES.CronRepository) private cronRepository: CronRepository,
		@inject(TYPES.CryptomusService) private cryptomus: CryptomusService,
	) {}
	init(): void {
		console.log(1);
		cron.schedule('*/5 * * * * *', async () => {
			const payments = await this.cronRepository.findMany();
			if (!payments) {
				return null;
			}
			for (const payment of payments) {
				const res = await this.cryptomus.checkPayment(payment.uuid);
				if (!res) {
					console.log('ошибка');
					continue;
				}
				console.log(2);
				console.log(payment);
				if (res.result.is_final) {
					console.log(res.result.status);
				}
				//получение id для обновления статуса корзины
				const { id } = await this.cronRepository.update(
					payment.uuid,
					payment.finnalyPrice,
					payment.isFinal,
				);
				await this.cronRepository.updateBuyingStatusBakset(id);
			}
		});
	}
}
