import { IsBoolean, IsString } from 'class-validator';

export class updateProductToBasketDto {
	@IsString({ message: 'неверный id' })
	id: string;
	@IsString({ message: 'неверное количество' })
	quantity!: number;
	@IsBoolean()
	buying!: boolean;
}
