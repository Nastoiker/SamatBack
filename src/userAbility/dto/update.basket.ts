import { IsBoolean, IsString } from 'class-validator';

export class updateProductToBasketDto {
	@IsString({ message: 'неверный id' })
	id: string;
	@IsBoolean()
	buying!: boolean;
}
