import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { inject, injectable } from 'inversify';
import { Basket, BoughtProduct } from '@prisma/client';
@injectable()
export class CronRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async findMany(): Promise<BoughtProduct[] | null> {
		return this.prismaService.client.boughtProduct.findMany({
			where: {
				isFinal: false,
			},
		});
	}
	async createPayment(
		uuid: string,
		orderId: string,
		status: string,
		amount: string,
		isFinal: boolean,
		userId: string,
	) {
		return this.prismaService.client.boughtProduct.create({
			data: {
				uuid,
				isFinal,
				userId,
				delivered: false,
				finnalyPrice: amount,
			},
		});
	}

	async update(uuid: string, paymentAmount: string, isFinal: boolean) {
		return this.prismaService.client.boughtProduct.update({
			where: { uuid },
			data: {
				uuid,
				finnalyPrice: paymentAmount,
				isFinal,
			},
		});
	}
	async getBasketProduct(id: string): Promise<Basket | null> {
		return this.prismaService.client.basket.findFirst({
			where: {
				id,
			},
			include: {
				product: true,
			},
		});
	}
	async updateBuyingStatusBakset(id: string) {
		return this.prismaService.client.basket.updateMany({
			where: {
				boughtProductId: id,
			},
			data: {
				buying: true,
			},
		});
	}
}
