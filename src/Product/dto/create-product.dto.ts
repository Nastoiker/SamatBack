import { IsArray, IsNumber, IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { UserModel } from '@prisma/client';
import {MFile} from "../../files/mfile.class";
export class ProductModel {
	@IsString()
	name: string;
	@IsString()
	alias: string;
	@IsString()
	@IsOptional()
	color?: string;
  @IsString()
  Description: string;
	@IsString()
	@IsOptional()
	ColorAlias?: string;
	@IsString()
	@IsOptional()
	image?: string;
  @IsString()
	secondCategoryId: string;
  @IsArray()
  favorite: Favorite[];
  @IsArray()
  comment: Comment[];
	@IsString()
	modelDeviceId: string;
  
}
export class Favorite {
	@IsString()
	modelId: string;
	@IsString()
	userId: string;
}
export class ProductUpdate {
	@IsString()
	name: string;
	@IsNumber()
	price: number;
	@IsOptional()
	@IsNumber()
	oldPrice: number;
}
// export class ProductModel {
// 	@IsString()
// 	firstLevelCategory: string;
// 	@IsString()
// 	secondLevelCategory: string;
// 	@IsString()
// 	name: string;
// 	@IsNumber()
// 	price: number;
// 	@IsOptional()
// 	@IsNumber()
// 	oldPrice?: number;
// 	@IsNumber()
// 	brandId?: number;
// 	@IsNumber()
// 	modelDeviceId?: number;
// 	@IsString()
// 	@IsArray()
// 	tags?: Tag[];
// 	@IsNumber()
// 	@IsArray()
// 	rating?: Rating[];
// 	@IsArray()
// 	Comment?: Comment[];
// }
export class ProductCreate {
	@IsString()
	name: string;
	@IsString()
	alias: string;
	@IsString()
	brandId: string;
	@IsString()
	secondCategoryId: string;
	@IsString()
	@IsOptional()
	image?: string;
	@IsString()
	Description: string;
}
export class ModelCreate {
	@IsString()
	name: string;
	@IsString()
	secondCategoryId: string;
	@IsString()
	brandId: string;
	@IsString()
	modelDeviceId: string;
	@IsString()
	Description: string;
}
export class BrandDevice {
	@IsString()
	name: string;
}
export class ModelDeviceDto {
	@IsString()
	name: string;
	@IsString()
	secondCategoryId: string;
	@IsString()
	brandId: string;
}
export class Rating {
	@IsString()
	writtenById: string;
	@IsString()
	modelDeviceId: string;
	@IsNumber()
	number: number;
}
export class Comment {
	@IsString()
	comment: string;
	@IsString()
	writtenById: string;
	@IsString()
	modelDeviceId: string;

	@IsString()
	title: string;
	file?: MFile[];
}

export class BrandModel {
	@IsString()
	@IsArray()
	modelID: string[];
}
export interface brandOnSecondCategory {
	brand: { connect: { id: string } };
}
export interface SecondCategoryOnbrand {
	category: { connect: { id: string } };
}
