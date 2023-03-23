import { PrismaService } from '../database/prisma.service';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {
	BrandDevice,
	brandOnSecondCategory,
	Comment,
	ModelDeviceDto,
	ProductModel,
	ProductUpdate,
	Rating,
	SecondCategoryOnbrand,
} from './dto/create-product.dto';
import {
	Brand,
	ModelDevice,
	Product,
	Tag,
	SecondLevelCategory,
	FirstLevelCategory,
	Basket,
	Prisma,
} from '@prisma/client';
import { IProductRepository } from './product.repository.interface';
import { setBrandsOnCategory, setSecondCategoryOnBrand } from './dto/firstCategory.dto';

@injectable()
export class ProductRepository implements IProductRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}
	async findLikeSqlModelBrand(searchByWorld: string): Promise<Product[] | null> {
		console.log(searchByWorld);
		// const query = `%${searchByWorld}%`;
		// return await this.prismaService.client.$queryRawUnsafe<Product[]>(
		// 	'SELECT * FROM Product where name LIKE $1',
		// 	`%${searchByWorld}`,
		// );
		return await this.prismaService.client.product.findMany({
			where: {
				name: {
					startsWith: searchByWorld,
				},
			},
		});
	}
	async createProduct(data: ProductModel): Promise<Product> {
		return this.prismaService.client.product.create({
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
	async findProduct(name: string): Promise<Product | null> {
		return this.prismaService.client.product.findFirst({
			where: {
				name,
			},
		});
	}
	async findByAlias(alias: string): Promise<Product | null> {
		return this.prismaService.client.product.findFirst({
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
	async getProductById(id: string): Promise<Product | null> {
		return await this.prismaService.client.product.findFirst({
			where: {
				id,
			},
			include: {
				brand: true,
				modelDevice: true,
			},
		});
	}
	async findProducts(brandId: string): Promise<Product[] | null> {
		return this.prismaService.client.product.findMany({
			where: {
				brandId,
			},
		});
	}
	async deleteProduct(id: string): Promise<Product | null> {
		return this.prismaService.client.product.delete({
			where: {
				id,
			},
		});
	}
	async getProductByCategory(firstLevelId: string): Promise<SecondLevelCategory[] | null> {
		return this.prismaService.client.secondLevelCategory.findMany({
			where: {
				firstLevelId,
			},
		});
	}
	async getBrandProductByCategory(categoryId: string) {
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
	async updateByIdPhoto(id: string, image: string): Promise<Product | null> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data: {
				image,
			},
		});
	}
	async addProductToBasket(
		productId: string,
		userId: string,
		quantity: number,
		buying: boolean,
	): Promise<Basket | null> {
		return this.prismaService.client.basket.create({
			data: {
				productId,
				userId,
				quantity,
				buying,
			},
		});
	}
	async updateByIdPrice(id: string, price: number): Promise<Product | null> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data: {
				price,
			},
		});
	}
	async updateProduct(id: string, product: ProductUpdate): Promise<Product | null> {
		return this.prismaService.client.product.update({
			where: {
				id,
			},
			data: {
				...product,
			},
		});
	}

	async findBrandByName(name: string): Promise<Brand | null> {
		return this.prismaService.client.brand.findFirst({
			where: {
				name,
			},
			include: {
				Product: true,
			},
		});
	}
	async createModelProduct(model: ModelDeviceDto): Promise<ModelDevice | null> {
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
				product: true,
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
				product: true,
			},
		});
	}
	async getTags(): Promise<Tag[]> {
		return this.prismaService.client.tag.findMany({});
	}
	async getAllProducts() {
		return await this.prismaService.client.modelDevice.findMany({
			include: {
				brand: true,
				Comment: true,
				product: true,
			},
		});
	}
	async setCommentProduct(
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
	async getProductByBrandSecondCategory(secondCategoryId: string, brandId: string) {
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
	async getProductsDiscount(): Promise<Product[]> {
		return this.prismaService.client.product.findMany({
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
// }: ProductCreate): Promise<Product> {
// 	const commentest = JSON.stringify(Comment);
// 	return this.prismaService.client.product.create({
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
