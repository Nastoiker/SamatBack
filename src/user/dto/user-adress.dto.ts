import { IsEmail, IsString } from 'class-validator';

export class UserAdressDto {
	@IsString({ message: 'Неверный город' })
	city!: string;
	@IsString({ message: 'Неверная улица' })
	street: string;
	userId: string;
	country: 'Russia';
}
