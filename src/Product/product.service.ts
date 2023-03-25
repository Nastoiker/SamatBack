import { IProductService } from './product.service.interface';
import {
	Brand,
	SecondLevelCategory,
	FirstLevelCategory,
	Comment,
	ModelDevice,
	Tag,
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
export class ProductService {
	constructor(@inject(TYPES.ProductRepository) private productRepository: ProductRepository) {}
	async findLikeSqlModelBrand(searchByWorld: string): Promise<ModelDevice[] | null> {
		return this.productRepository.findLikeSqlModelBrand(searchByWorld);
	}
	async create(product: ProductCreate): Promise<ModelDevice | null> {
		if (await this.productRepository.findmodelDevice(product.name)) {
			return null;
		}
		return this.productRepository.createModel(product);
	}
	async createBrand(brand: BrandDevice): Promise<Brand | null> {
		if (await this.productRepository.findBrand(brand.name)) {
			return null;
		}
		// const checkProduct = await this.getModelBrandId(brand);
		return this.productRepository.createBrand(brand);
	}
	async delete(id: string): Promise<ModelDevice | null> {
		return this.productRepository.deletemodelDevice(id);
	}
	async findByAlias(alias: string): Promise<ModelDevice | null> {
		return this.productRepository.findByAlias(alias);
	}
	async find(name: string): Promise<ModelDevice | null> {
		return this.productRepository.findmodelDevice(name);
	}
	async findProducts(brandId: string): Promise<ModelDevice[] | null> {
		return this.productRepository.findmodelDevices(brandId);
	}
	async update(product: ProductUpdate): Promise<ModelDevice | null> {
		const id = await this.productRepository.findmodelDevice(product.name);
		if (!id) {
			return null;
		}
		return this.productRepository.updatemodelDevice(id.id, product);
	}
	async setCategoryOnBrand(setBrandsOnCategory: setBrandsOnCategory): Promise<Brand> {
		return this.productRepository.setCategoryOnBrand(setBrandsOnCategory);
	}
	// async getModelBrandId(product: ProductCreate) {
	// 	const brandId = await this.productRepository.findBrandByName(product.brandId);
	// 	const modelId = await this.productRepository.findModelByName(product.modelDeviceId);
	// 	const tag = await this.productRepository.findTagByName(product.TagId);
	// 	return { ...product, brandId: brandId?.id, modelDeviceId: modelId?.id, TagId: tag?.id };
	// }
	async getAll(): Promise<(ModelDevice & { brand: Brand; Comment: Comment[] })[]> {
		return this.productRepository.getAllmodelDevices();
	}
	async getByFirstCategory(firstLevelId: string): Promise<SecondLevelCategory[] | null> {
		return this.productRepository.getmodelDeviceByCategory(firstLevelId);
	}
	async setSecondCategory(
		name: string,
		firstLevelId: string,
		alias: string,
	): Promise<SecondLevelCategory | null> {
		return this.productRepository.setSecondCategory(name, firstLevelId, alias);
	}
	async saveFile(files: MFile[], productId: string): Promise<ModelDevice | null> {
		const product = await this.productRepository.getmodelDeviceById(productId);
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
			!pathExistsSync(`./uploads/product/${brandId}/${modelDeviceId}`)
		) {
			mkdir(`./uploads/product/${brandId}/${modelDeviceId}`, (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
		const upload = `${path}/uploads/product`;
		const res: FileElementResponse[] = [];
		let images = '';
		for (const file of files) {
			await access(`${upload}/${brandId}/${modelDeviceId}/${file.originalname}`, (err) => {
				writeFile(
					`${upload}/${brandId}/${modelDeviceId}/${file.originalname}`,
					file.buffer,
				);
			});
			res.push({
				url: `${upload}/${brandId}/${modelDeviceId}/${name}`,
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
	async getById(id: string): Promise<ModelDevice | null> {
		return await this.productRepository.getmodelDeviceById(id);
	}
	//создание категории к брендам
	async getProductByBrandSecondCategory(
		secondLevelId: string,
		brandId: string,
	): Promise<ModelDevice[] | null> {
		return this.productRepository.getmodelDeviceByBrandSecondCategory(secondLevelId, brandId);
	}
	async getBrandProductByCategory(secondLevelId: string): Promise<Brand[]> {
		return this.productRepository.getBrandmodelDeviceByCategory(secondLevelId);
	}
	async getBrands(): Promise<Brand[]> {
		return this.productRepository.getBrands();
	}
	async getTags(): Promise<Tag[]> {
		return this.productRepository.getTags();
	}
}
