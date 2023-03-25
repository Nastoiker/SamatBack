import { Favorite, UserModel, Comment } from '@prisma/client';
import { User } from './user.entity';

export interface IUserRepository {
	find: (email: string) => Promise<UserModel | null>;
	createUser: (user: User) => Promise<UserModel>;
	findProfile: (login: string) => Promise<UserModel | null>;
	getFavoriteByUser: (userId: string) => Promise<Favorite[] | null>;
	updateAvatar: (avatar: string, id: string) => Promise<UserModel>;
	checkActiveUser: (id: string) => Promise<UserModel | null>;
	verifyEmail: (id: string) => Promise<UserModel | null>;
	deleteComment: (commentId: string) => Promise<Comment | null>;
	getProfileInfoById: (id: string) => Promise<UserModel | null>;
}
