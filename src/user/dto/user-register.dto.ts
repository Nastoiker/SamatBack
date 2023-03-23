import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'не передан email' })
	email!: string;
	@IsString({ message: 'не передан login' })
	login!: string;
	@IsString({ message: 'не передан password' })
	password!: string;
}
