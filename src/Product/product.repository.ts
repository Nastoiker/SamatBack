import { PrismaService } from '../database/prisma.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {
	BrandDevice,
	brandOnSecondCategory,
	Comment,
	ModelDeviceDto,
	modelDeviceModel,
	modelDeviceUpdate,
	Rating,
	SecondCategoryOnbrand,
} from './dto/create-modelDevice.dto';
import {
	Brand,
	ModelDevice,
	modelDevice,
	Tag,
	SecondLevelCategory,
	FirstLevelCategory,
	Basket,
	Prisma,
} from '@prisma/client';
import { ImodelDeviceRepository } from './modelDevice.repository.interface';
import { setBrandsOnCategory, setSecondCategoryOnBrand } from './dto/firstCategory.dto';

@injectable()
export class ProductRepository implements ImodelDeviceRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async findLikeSqlModelBrand(searchByWorld: string): Promise<modelDevice[] | null> {
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
	async createmodelDevice(data: modelDeviceModel): Promise<modelDevice> {
		return this.prismaService.client.modelDevice.create({
			data: { ...data },
		});
	}
	async createModel(data: ModelDeviceDto): Promise<ModelDevice> {
		return this.prismaService.client.modelDevice.create({
			data: { ...data },
		});
	}
	async createBrand(data: BrandDevice): Promise<Brand> {
		return this.prismaService.client.brand.create({
			data: { ...data },
		});
	}
	async findmodelDevice(name: string): Promise<modelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				name,
			},
		});
	}
	async findByAlias(alias: string): Promise<modelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				alias,
			},
			include: {
				brand: true,
				modelDevice: true,
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
	async getmodelDeviceById(id: string): Promise<modelDevice | null> {
		return await this.prismaService.client.modelDevice.findFirst({
			where: {
				id,
			},
			include: {
				brand: true,
				modelDevice: true,
			},
		});
	}
	async findmodelDevices(brandId: string): Promise<modelDevice[] | null> {
		return this.prismaService.client.modelDevice.findMany({
			where: {
				brandId,
			},
		});
	}
	async deletemodelDevice(id: string): Promise<modelDevice | null> {
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
	async updateByIdPhoto(id: string, image: string): Promise<modelDevice | null> {
		return this.prismaService.client.modelDevice.update({
			where: {
				id,
			},
			data: {
				image,
			},
		});
	}
	async addmodelDeviceToBasket(
		modelDeviceId: string,
		userId: string,
		quantity: number,
		buying: boolean,
	): Promise<Basket | null> {
		return this.prismaService.client.basket.create({
			data: {
				modelDeviceId,
				userId,
				quantity,
				buying,
			},
		});
	}
	async updateByIdPrice(id: string, price: number): Promise<modelDevice | null> {
		return this.prismaService.client.modelDevice.update({
			where: {
				id,
			},
			data: {
				price,
			},
		});
	}
	async updatemodelDevice(id: string, modelDevice: modelDeviceUpdate): Promise<modelDevice | null> {
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
				modelDevice: true,
			},
		});
	}
	async createModelmodelDevice(model: ModelDeviceDto): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.create({
			data: { ...model },
		});
	}
	async findModelByName(name: string): Promise<ModelDevice | null> {
		return this.prismaService.client.modelDevice.findFirst({
			where: {
				name,
			},
			include: {
				modelDevice: true,
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
				modelDevice: true,
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
				modelDevice: true,
			},
		});
	}
	async setCommentmodelDevice(
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
	async getmodelDevicesDiscount(): Promise<modelDevice[]> {
		return this.prismaService.client.modelDevice.findMany({
			where: {
				NOT: [
					{
						oldPrice: null,
					},
				],
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
