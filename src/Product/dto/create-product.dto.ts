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
	@IsNumber()
	quantity: number;
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
	@IsNumber()
	quantity: number;
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
	@IsNumber()
	price: number;
	@IsOptional()
	@IsNumber()
	oldPrice?: number;
	@IsString()
	brandId: string;
	@IsString()
	TagId: string;
	@IsNumber()
	@IsOptional()
	Ram?: number;
	@IsNumber()
	@IsOptional()
	Memory?: number;
	@IsString()
	@IsOptional()
	Color?: string;
	@IsString()
	@IsOptional()
	ColorAlias?: string;
	@IsString()
	@IsOptional()
	image?: string;
	@IsNumber()
	quantity: number;
	@IsString()
	modelDeviceId: string;
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

	@IsNumber()
	quantity: number;
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
export class Tag {
	@IsString()
	tag: String;
	@IsString()
	@IsArray()
	ProductID: string[];
}
export class BrandModel {
	@IsString()
	tag: String;
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
