import { IUserRepository } from './user.repository.interface';
import { PrismaService } from '../database/prisma.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {Favorite, UserModel, Comment} from '@prisma/client';
import { User } from './user.entity';

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
	async getFavoriteByUser(userId: string): Promise<Favorite[] | null> {
		return this.prismaService.client.favorite.findMany({
			where: {
				userId,
			},
			include: {
				model: true,
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
				favorite: true,
				rating: true,
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

}
