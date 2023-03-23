import { inject, injectable } from 'inversify';
import { IProductRepository } from '../Product/product.repository.interface';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { ModelDevice, Tag, Comment } from '@prisma/client';

@injectable()
export class AdminRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async deleteModel(id: string): Promise<ModelDevice> {
		return this.prismaService.client.modelDevice.delete({
			where: {
				id,
			},
		});
	}
	async deleteComment(id: string): Promise<Comment> {
		return this.prismaService.client.comment.delete({
			where: {
				id,
			},
		});
	}
	async updateTagFromProduct(id: string, TagId: string): Promise<Tag> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data: {
				TagId,
			},
		});
	}
}
