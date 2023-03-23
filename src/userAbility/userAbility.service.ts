import { Comment, Rating } from '../Product/dto/create-product.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from '../user/user.repository.interface';
import { ProductRepository } from '../Product/product.repository';
import { UserAbilityRepository } from './userAbility.repository';
import { UserModel, Basket, Product } from '@prisma/client';
import { updateProductToBasketDto } from './dto/update.basket';
import { MFile } from '../files/mfile.class';
import { access, pathExistsSync, writeFile } from 'fs-extra';
import { mkdir } from 'fs';
import { path } from 'app-root-path';
import { FileElementResponse } from '../files/dto/fileElement.response';
@injectable()
export class UserAbilityService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.ProductRepository) private productRepository: ProductRepository,
		@inject(TYPES.UserAbilityRepository)
		private userAbilityServiceRepository: UserAbilityRepository,
	) {}
	async deleteComment(commentId: string) {
		return this.userRepository.deleteComment(commentId);
	}
	async setComment(comment: Comment) {
		if (!comment.file) {
			return this.productRepository.setCommentProduct(
				comment.comment,
				comment.writtenById,
				comment.modelDeviceId,
				comment.title,
				'',
			);
		}
		const model = await this.productRepository.findModelById(comment.modelDeviceId);
		if (!model) {
			return null;
		}
		// @ts-ignore
		const brandName = model['brand']['name'];
		const modelDeviceName = model.name.trim().replace(' ', '-');
		if (!pathExistsSync(`./uploads/comment/${brandName}`)) {
			mkdir(`./uploads/comment/${brandName}`, (err) => {
				// eslint-disable-next-line no-empty
				if (err) {
					console.error(err);
				}
			});
		}
		if (!pathExistsSync(`./uploads/comment/${brandName}/${modelDeviceName}`)) {
			mkdir(`./uploads/comment/${brandName}/${modelDeviceName}`, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		if (
			!pathExistsSync(
				`./uploads/comment/${brandName}/${modelDeviceName}/${comment.writtenById}`,
			)
		) {
			mkdir(
				`./uploads/comment/${brandName}/${modelDeviceName}/${comment.writtenById}`,
				(err) => {
					if (err) {
						console.error(err);
					}
				},
			);
		}
		const upload = `${path}/uploads/comment`;
		const res: FileElementResponse[] = [];
		let images = '';
		for (const file of comment.file) {
			await access(
				`${upload}/${brandName}/${modelDeviceName}/${comment.writtenById}/${file.originalname}`,
				(err) => {
					writeFile(
						`${upload}/${brandName}/${modelDeviceName}/${comment.writtenById}/${file.originalname}`,
						file.buffer,
					);
				},
			);
			res.push({
				url: `${upload}/${brandName}/${modelDeviceName}/${comment.writtenById}/${comment.title}`,
				name: file.originalname,
			});
			if (images.length > 0) {
				images.concat(`/${file.originalname.split('.')[0]}.webp`);
			} else {
				images = `${file.originalname.split('.')[0]}.webp`;
			}
		}
		return this.productRepository.setCommentProduct(
			comment.comment,
			comment.writtenById,
			comment.modelDeviceId,
			comment.title,
			images,
		);
	}
	async addBasket(productId: string, userId: string, quantity: number): Promise<Basket | null> {
		return this.productRepository.addProductToBasket(productId, userId, quantity, false);
	}
	async getBasketUser(userId: string): Promise<Basket[] | null> {
		return this.userRepository.getBasketByUser(userId);
	}
	public async getUserInfo(user: string): Promise<UserModel | null> {
		return this.userRepository.find(user);
	}
	async setRatingProduct(rating: Rating): Promise<Rating | null> {
		return this.productRepository.setRating(rating);
	}
	async deleteBasket(id: string): Promise<Basket | null> {
		return this.userAbilityServiceRepository.deleteProductToBasket(id);
	}
	async editQuantityBasketProduct(id: string, quantity: number): Promise<Basket | null> {
		return this.userAbilityServiceRepository.editQuantityBasketProduct(id, quantity);
	}
	async updateProductToBasket(basket: updateProductToBasketDto): Promise<Basket | null> {
		return this.userAbilityServiceRepository.updateProductToBasket(basket);
	}
}
