import { PrismaService } from '../database/prisma.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {
	BrandDevice,
	brandOnSecondCategory,
	Comment,
	ModelDeviceDto,
	ProductCreate,
	ProductModel,
	ProductUpdate,
	Rating,
	SecondCategoryOnbrand,
} from './dto/create-product.dto';
import {
	Brand,
	ModelDevice,
	Tag,
	SecondLevelCategory,
	FirstLevelCategory,
	Favorite,
} from '@prisma/client';
import { setBrandsOnCategory, setSecondCategoryOnBrand } from './dto/firstCategory.dto';

@injectable()
export class ProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async findLikeSqlModelBrand(searchByWorld: string): Promise<ModelDevice[] | null> {
		console.log(searchByWorld);
		// const query = `%${searchByWorld}%`;
		// return await this.prismaService.client.$queryRawUnsafe<modelDevice[]>(
		// 	'SELECT * FROM modelDevice where name LIKE $1',
		// 	`%${searchByWorld}`,
		// );
		return await this.prismaService.client.modelDevice.findMany({
			where: {
				name: {
					startsWith: searchByWorld,
				},
			},
		});
	}
	async createModel(data: ProductCreate): Promise<ModelDevice> {
		return this.prismaService.client.modelDevice.create({
			data: { ...data },
		});
	}
	async createBrand(data: BrandDevice): Promise<Brand> {
		return this.prismaService.client.brand.create({
			data: { ...data },
		});
	}
	async findmodelDevice(name: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				name,
			},
		});
	}
	async findByAlias(alias: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				alias,
			},
			include: {
				brand: true,
			},
		});
	}

	async findBrand(name: string): Promise<Brand | null> {
		return this.prismaService.client.brand.findFirst({
			where: {
				name,
			},
		});
	}
	async getmodelDeviceById(id: string): Promise<ModelDevice | null> {
		return await this.prismaService.client.modelDevice.findFirst({
			where: {
				id,
			},
			include: {
				brand: true,
			},
		});
	}
	async findmodelDevices(brandId: string): Promise<ModelDevice[] | null> {
		return this.prismaService.client.modelDevice.findMany({
			where: {
				brandId,
			},
		});
	}
	async deletemodelDevice(id: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.delete({
			where: {
				id,
			},
		});
	}
	async getmodelDeviceByCategory(firstLevelId: string): Promise<SecondLevelCategory[] | null> {
		return this.prismaService.client.secondLevelCategory.findMany({
			where: {
				firstLevelId,
			},
		});
	}
	async getBrandmodelDeviceByCategory(categoryId: string) {
		return this.prismaService.client.brand.findMany({
			where: {
				secondLevelCategory: {
					some: {
						category: {
							id: categoryId,
							// alias: 'smartphones',
						},
					},
				},
			},
		});
	}
	async updateByIdPhoto(id: string, image: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.update({
			where: {
				id,
			},
			data: {
				image,
			},
		});
	}
	async addmodelDeviceToFavorite(modelId: string, userId: string): Promise<Favorite | null> {
		return this.prismaService.client.favorite.create({
			data: {
				modelId,
				userId,
			},
		});
	}

	async updatemodelDevice(id: string, modelDevice: ProductUpdate): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.update({
			where: {
				id,
			},
			data: {
				...modelDevice,
			},
		});
	}

	async findBrandByName(name: string): Promise<Brand | null> {
		return this.prismaService.client.brand.findFirst({
			where: {
				name,
			},
			include: {
				model: true,
			},
		});
	}

	async findModelByName(name: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				name,
			},
		});
	}
	async findModelById(id: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				id,
			},
			include: {
				brand: true,
			},
		});
	}
	async findTagByName(name: string): Promise<Tag | null> {
		return this.prismaService.client.tag.findFirst({
			where: {
				name,
			},
			include: {
				model: true,
			},
		});
	}
	async getTags(): Promise<Tag[]> {
		return this.prismaService.client.tag.findMany({});
	}
	async getAllmodelDevices() {
		return await this.prismaService.client.modelDevice.findMany({
			include: {
				brand: true,
				Comment: true,
			},
		});
	}
	async setCommentModelDevice(
		comment: string,
		writtenById: string,
		modelDeviceId: string,
		title: string,
		pictures: string,
	): Promise<Comment> {
		return this.prismaService.client.comment.create({
			data: {
				comment,
				modelDeviceId,
				title,
				writtenById,
				pictures,
			},
		});
	}
	async setSecondCategory(
		name: string,
		firstLevelId: string,
		alias: string,
	): Promise<SecondLevelCategory> {
		return this.prismaService.client.secondLevelCategory.create({
			data: {
				name,
				firstLevelId,
				alias,
			},
			include: {
				firstLevelCategory: true,
			},
		});
	}
	async getCategory(): Promise<FirstLevelCategory[]> {
		return this.prismaService.client.firstLevelCategory.findMany({
			include: {
				secondLevelCategory: true,
			},
		});
	}
	async getBrands(): Promise<Brand[]> {
		return this.prismaService.client.brand.findMany();
	}
	async setRating(rating: Rating): Promise<Rating> {
		return this.prismaService.client.rating.create({
			data: rating,
		});
	}
	//создание категории к брендам
	async setBrandOnSecondCategory(setBrandsOnCategory: setSecondCategoryOnBrand) {
		const brands = setBrandsOnCategory.id;
		const setBrands: brandOnSecondCategory[] = [];
		for (const brand of brands) {
			setBrands.push({ brand: { connect: { id: brand } } });
		}
		const { name, firstLevelId, alias } = setBrandsOnCategory;
		return await this.prismaService.client.secondLevelCategory.create({
			data: {
				name,
				alias,
				firstLevelId,
				brands: {
					create: [...setBrands],
				},
			},
		});
	}

	//создание брендов к категории
	async setCategoryOnBrand(setCategoryOnBrand: setBrandsOnCategory): Promise<Brand> {
		const brands = setCategoryOnBrand.categories;
		const setBrands: SecondCategoryOnbrand[] = [];
		for (const brand of brands) {
			setBrands.push({ category: { connect: { id: brand } } });
		}
		const name = setCategoryOnBrand.name;
		return this.prismaService.client.brand.create({
			data: {
				name,
				secondLevelCategory: {
					create: [...setBrands],
				},
			},
		});
	}
	async getmodelDeviceByBrandSecondCategory(secondCategoryId: string, brandId: string) {
		return await this.prismaService.client.modelDevice.findMany({
			where: {
				secondCategoryId,
				brandId,
			},
			include: {
				brand: true,
				Comment: true,
			},
		});
	}
}
// constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
// async create({
// 	firstLevelCategory,
// 	secondLevelCategory,
// 	brand,
// 	modelDevice,
// 	name,
// 	price,
// 	oldPrice,
// 	tags,
// 	brandId,
// 	modelDeviceId,
// 	Comment,
// }: modelDeviceCreate): Promise<modelDevice> {
// 	const commentest = JSON.stringify(Comment);
// 	return this.prismaService.client.modelDevice.create({
// 		data: {
// 			firstLevelCategory,S
// 			secondLevelCategory,
// 			brand: {
// 				create: {
// 					...brand,
// 				},
// 			},
// 			modelDevice: {S
// 				create: {
// 					...modelDevice,
// 				},
// 			},
// 			name,
// 			price,
// 			oldPrice,
// 			brandId,
// 			modelDeviceId,
// 			Comment: {
// 				create: [
// 					...commentest,
// 			},
// 		},
// 		include: {
// 			Comment: true,
// 		},
// 	});
// }
