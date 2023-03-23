import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';
export class setSecondCategoryOnBrand {
	@IsString()
	name: string;
	@IsString()
	firstLevelId: string;
	@IsString()
	alias: string;
	@IsArray()
	@IsString()
	id: string[];
}

export class setBrandsOnCategory {
	@IsString()
	name: string;
	@IsArray()
	@IsString()
	categories: string[];
}
