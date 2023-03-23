import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Basket, UserModel } from '@prisma/client';
import { MFile } from '../files/mfile.class';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<void>;
	ValidateUser: (dto: UserLoginDto) => Promise<boolean>;
	getJWT: (email: string) => Promise<void>;
	getUserInfo: (email: string) => Promise<UserModel | null>;
	getBasketByUser: (userId: string) => Promise<Basket[] | null>;
	saveAvatar: (file: MFile, userId: string) => Promise<UserModel>;
	getProfileInfoById: (id: string) => Promise<UserModel | null>;
}
