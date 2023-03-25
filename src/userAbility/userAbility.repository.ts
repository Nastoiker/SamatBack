import { IProductRepository } from '../Product/product.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { PrismaService } from '../database/prisma.service';
import { Comment } from '../Product/dto/create-product.dto';
import { Favorite } from '@prisma/client';
import { updateProductToBasketDto } from './dto/update.basket';
@injectable()
export class UserAbilityRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async setCommentProduct(comment: Comment): Promise<Comment> {
		return this.prismaService.client.comment.create({
			data: {
				...comment,
			},
			include: {
				model: true,
				writtenBy: true,
			},
		});
	}
	async deleteProductToBasket(id: string): Promise<Favorite | null> {
		return this.prismaService.client.favorite.delete({
			where: {
				id,
			},
		});
	}


	async addProductToBasket(
		modelId: string,
		userId: string,

	): Promise<Favorite | null> {
		return await this.prismaService.client.favorite.create({
			data: {
				modelId,
				userId,
			},
		});
	}
}
