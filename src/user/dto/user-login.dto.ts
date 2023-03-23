import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'неверный login' })
	email!: string;
	@IsString({ message: 'неверный password' })
	password!: string;
}
