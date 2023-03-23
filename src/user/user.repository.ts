import { IUserRepository } from './user.repository.interface';
import { PrismaService } from '../database/prisma.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {Basket, UserModel, Comment, Address} from '@prisma/client';
import { User } from './user.entity';
import {UserAdressDto} from "./dto/user-adress.dto";
import {UserEditProfileDto} from "./dto/user-editProfile.dto";
@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async createUser({ email, login, hashpassword }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				isActive: false,
				email,
				login,
				hashpassword,
			},
		});
	}
	async updateAvatar(avatar: string, id: string): Promise<UserModel> {
		return this.prismaService.client.userModel.update({
			where: {
				id,
			},
			data: {
				avatar,
			},
		});
	}
	async getBasketByUser(userId: string): Promise<Basket[] | null> {
		return this.prismaService.client.basket.findMany({
			where: {
				userId,
			},
			include: {
				product: true,

			},
		});
	}
	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
			include: {
				Comment: true,
				basket: true,
				rating: true,
				address: true,
			},
		});
	}
	async findProfile(login: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				login,
			},
			include: {
				Comment: true,
			},
		});
	}

	async getProfileInfoById(id: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				id,
			},
			include: {
				Comment: true,
			},
		});
	}
	async checkActiveUser(id: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				id: id,
				isActive: true,
			},
		});
	}
	async verifyEmail(id: string): Promise<UserModel | null> {
		const checkActive = await this.checkActiveUser(id);
		if (checkActive) {
			return null;
		} else {
			return this.prismaService.client.userModel.update({
				where: { id },
				data: {
					isActive: true,
				},
			});
		}
	}
	async deleteComment(commentId: string): Promise<Comment | null> {
		return this.prismaService.client.comment.delete({
			where: {
				id: commentId,
			},
		});
	}
	async createAddress(address: UserAdressDto): Promise<Address | null> {
		return this.prismaService.client.address.create({
			data: { ...address },
		});
	}
	async editAddress(address: UserAdressDto): Promise<Address | null> {
		const { userId, ...addressUser } = address;
		return this.prismaService.client.address.update({
			where: {
				userId,
			},
			data: {
				...addressUser,
			},
		});
	}
	async editProfileInfo(info: UserEditProfileDto, id: string): Promise<UserModel | null> {
		const { password, ...inf } = info;
		return this.prismaService.client.userModel.update({
			where: {
				id,
			},
			data: {
				...inf,
			},
		});
	}
}
