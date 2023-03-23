import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { IUserRepository } from './user.repository.interface';
import {Address, UserModel} from '@prisma/client';
import { access, pathExistsSync, writeFile } from 'fs-extra';
import { path } from 'app-root-path';
import { MFile } from '../files/mfile.class';
import { mkdir } from 'fs';
import {UserAdressDto} from "./dto/user-adress.dto";
import {UserEditProfileDto} from "./dto/user-editProfile.dto";

@injectable()
export class UserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
	) {}
	public async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
		const validateUSer = await this.userRepository.find(email);
		if (!validateUSer) {
			return false;
		}
		const newUser = new User(email, validateUSer.login, validateUSer.hashpassword);
		return newUser.comparePassword(password);
	}
	public async createUser({
		email,
		login,
		password,
	}: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, login);
		const checkDB = await this.userRepository.find(email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		if (checkDB) {
			return null;
		}
		return this.userRepository.createUser(newUser);
	}
	public async getUserInfo(user: string): Promise<UserModel | null> {
		return this.userRepository.find(user);
	}
	public async saveAvatar(file: MFile, userId: string) {
		if (!pathExistsSync(`${path}/uploads/user/avatar/${userId}`)) {
			mkdir(`./uploads/user/avatar/${userId}`, (err) => {
				// eslint-disable-next-line no-empty
				if (err) {
					return console.error(err);
				}
			});
		}
		await access(`${path}/uploads/user/avatar/${userId}`, (err) => {
			writeFile(`${path}/uploads/user/avatar/${userId}/${file.originalname}`, file.buffer);
		});
		return this.userRepository.updateAvatar(file.originalname, userId);
	}
	async getProfileInfo(login: string) {
		return await this.userRepository.findProfile(login).then((res) => {
			if (res) {
				const { hashpassword, email, ...profile } = res;
				return profile;
			}
		});
	}
	async editAddress(address: UserAdressDto): Promise<Address | null> {
		return this.userRepository.editAddress(address);
	}
	async createAddress(address: UserAdressDto): Promise<Address | null> {
		return this.userRepository.createAddress(address);
	}
	async getProfileInfoById(id: string) {
		return await this.userRepository.getProfileInfoById(id).then((res) => {
			if (res) {
				const { hashpassword, email, ...profile } = res;
				return profile;
			}
		});
	}
	async verifyEmail(id: string): Promise<UserModel | null> {
		return await this.userRepository.verifyEmail(id);
	}
	async editProfileInfo(
		email: string,
		info: UserEditProfileDto,
		id: string,
	): Promise<UserModel | null> {
		const check = await this.validateUser({ email, password: info.password });
		if (!check) return null;
		const newUser = new User(email, info.login);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(info.hashpassword, Number(salt));
		info.hashpassword = newUser.hashpassword;
		return await this.userRepository.editProfileInfo(info, id);
	}
}
