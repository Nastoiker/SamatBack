import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'неверный login' })
	login: string;
	comment: Comment[];
}
export class Comment {
	@IsString()
	comment: string;
	@IsNumber()
	writtenById: number;
	@IsNumber()
	productId: number;
}
export class BoughtProduct {
	@IsBoolean()
	delivered: boolean;
	@IsString()
	userId: string;
	@IsNumber()
	finallyPrice: string;
}

export class AddressByUser {
	@IsString()
	city: string;
	@IsString()
	country: string;
	@IsString()
	street: string;
	@IsString()
	userId: string;
	@IsNumber()
	writtenById: number;
	@IsNumber()
	productId: number;
}
