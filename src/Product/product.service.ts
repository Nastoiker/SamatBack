import { IProductService } from './product.service.interface';
import {
	Brand,
	Product,
	SecondLevelCategory,
	FirstLevelCategory,
	Comment,
	ModelDevice, Tag,
} from '@prisma/client';
import {
	BrandDevice,
	ModelDeviceDto,
	ProductCreate,
	ProductModel,
	ProductUpdate,
} from './dto/create-product.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ProductRepository } from './product.repository';
import { writeFile, access, pathExistsSync } from 'fs-extra';
import { path } from 'app-root-path';

import { MFile } from '../files/mfile.class';
import { FileElementResponse } from '../files/dto/fileElement.response';
import { mkdir } from 'fs';
import { setBrandsOnCategory, setSecondCategoryOnBrand } from './dto/firstCategory.dto';
@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.ProductRepository) private productRepository: ProductRepository) {}
	async findLikeSqlModelBrand(searchByWorld: string): Promise<Product[] | null> {
		return this.productRepository.findLikeSqlModelBrand(searchByWorld);
	}
	async create(product: ProductCreate): Promise<Product | null> {
		if (await this.productRepository.findProduct(product.name)) {
			return null;
		}
		const checkProduct = await this.getModelBrandId(product);
		return this.productRepository.createProduct(checkProduct as unknown as ProductModel);
	}
	async createModel(model: ModelDeviceDto): Promise<ModelDevice | null> {
		if (await this.productRepository.findProduct(model.name)) {
			return null;
		}
		// const checkProduct = await this.getModelBrandId(model);
		return this.productRepository.createModel(model);
	}
	async createBrand(brand: BrandDevice): Promise<Brand | null> {
		if (await this.productRepository.findBrand(brand.name)) {
			return null;
		}
		// const checkProduct = await this.getModelBrandId(brand);
		return this.productRepository.createBrand(brand);
	}
	async delete(id: string): Promise<Product | null> {
		return this.productRepository.deleteProduct(id);
	}
	async findByAlias(alias: string): Promise<Product | null> {
		return this.productRepository.findByAlias(alias);
	}
	async find(name: string): Promise<Product | null> {
		return this.productRepository.findProduct(name);
	}
	async findProducts(brandId: string): Promise<Product[] | null> {
		return this.productRepository.findProducts(brandId);
	}
	async update(product: ProductUpdate): Promise<Product | null> {
		const id = await this.productRepository.findProduct(product.name);
		if (!id) {
			return null;
		}
		return this.productRepository.updateProduct(id.id, product);
	}
	async getModelBrandId(product: ProductCreate) {
		const brandId = await this.productRepository.findBrandByName(product.brandId);
		const modelId = await this.productRepository.findModelByName(product.modelDeviceId);
		const tag = await this.productRepository.findTagByName(product.TagId);
		return { ...product, brandId: brandId?.id, modelDeviceId: modelId?.id, TagId: tag?.id };
	}
	async getAll(): Promise<(ModelDevice & { brand: Brand; Comment: Comment[] })[]> {
		return this.productRepository.getAllProducts();
	}
	async getByFirstCategory(firstLevelId: string): Promise<SecondLevelCategory[] | null> {
		return this.productRepository.getProductByCategory(firstLevelId);
	}
	async setSecondCategory(
		name: string,
		firstLevelId: string,
		alias: string,
	): Promise<SecondLevelCategory | null> {
		return this.productRepository.setSecondCategory(name, firstLevelId, alias);
	}
	async saveFile(files: MFile[], productId: string): Promise<Product | null> {
		const product = await this.productRepository.getProductById(productId);
		if (!product) {
			return null;
		}
		// const { brandId, modelDeviceId, name } = product;
		// @ts-ignore
		const brandId = product['brand']['name'];
		// @ts-ignore
		const modelDeviceId = product['modelDevice']['name'].trim().replace(' ', '-');
		let image = product.image;
		if (!image) {
			image = '';
		}
		const name = product.name;
		if (!pathExistsSync(`./uploads/product/${brandId}`)) {
			mkdir(`./uploads/product/${brandId}`, (err) => {
				// eslint-disable-next-line no-empty
				if (err) {
					console.error(err);
				}
			});
		}
		if (!pathExistsSync(`./uploads/product/${brandId}/${modelDeviceId}`)) {
			mkdir(`./uploads/product/${brandId}/${modelDeviceId}`, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		if (
			!pathExistsSync(`./uploads/product/${brandId}/${modelDeviceId}/${product.ColorAlias}`)
		) {
			mkdir(`./uploads/product/${brandId}/${modelDeviceId}/${product.ColorAlias}`, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		const upload = `${path}/uploads/product`;
		const res: FileElementResponse[] = [];
		let images = '';
		for (const file of files) {
			await access(
				`${upload}/${brandId}/${modelDeviceId}/${product.ColorAlias}/${file.originalname}`,
				(err) => {
					writeFile(
						`${upload}/${brandId}/${modelDeviceId}/${product.ColorAlias}/${file.originalname}`,
						file.buffer,
					);
				},
			);
			res.push({
				url: `${upload}/${brandId}/${modelDeviceId}/${product.ColorAlias}/${name}`,
				name: file.originalname,
			});
			if (images.length > 0) {
				images.concat(`/${file.originalname.split('.')[0]}.webp`);
			} else {
				images = `${file.originalname.split('.')[0]}.webp`;
			}
		}
		return await this.productRepository.updateByIdPhoto(productId, images + ',' + image);
	}
	async getCategory(): Promise<FirstLevelCategory[] | null> {
		return this.productRepository.getCategory();
	}
	async getById(id: string): Promise<Product | null> {
		return await this.productRepository.getProductById(id);
	}
	//создание категории к брендам
	async getProductByBrandSecondCategory(
		secondLevelId: string,
		brandId: string,
	): Promise<ModelDevice[] | null> {
		return this.productRepository.getProductByBrandSecondCategory(secondLevelId, brandId);
	}
	async getBrandProductByCategory(secondLevelId: string): Promise<Brand[]> {
		return this.productRepository.getBrandProductByCategory(secondLevelId);
	}
	async getBrands(): Promise<Brand[]> {
		return this.productRepository.getBrands();
	}
	async getProductsDiscount(): Promise<Product[]> {
		return this.productRepository.getProductsDiscount();
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
	async getTags(): Promise<Tag[]> {
		return this.productRepository.getTags();
	}
}
