import {
	ProductCreate,
	ProductUpdate,
	ModelCreate,
	ModelDeviceDto,
	BrandDevice,
} from './dto/create-product.dto';
import { setBrandsOnCategory, setSecondCategoryOnBrand } from './dto/firstCategory.dto';
import {
	Brand,
	FirstLevelCategory,
	ModelDevice,
	SecondLevelCategory,
	Comment,
} from '@prisma/client';
import { FileElementResponse } from '../files/dto/fileElement.response';
import { MFile } from '../files/mfile.class';

export interface IProductService {
	create: (product: ProductCreate) => Promise<ModelDevice | null>;
	createBrand: (brand: BrandDevice) => Promise<Brand | null>;
	findLikeSqlModelBrand: (searchByWorld: string) => Promise<ModelDevice[] | null>;

	find: (name: string) => Promise<ModelDevice | null>;
	findByAlias: (alias: string) => Promise<ModelDevice | null>;
	getById: (id: string) => Promise<ModelDevice | null>;
	delete: (id: string) => Promise<ModelDevice | null>;
	update: (product: ProductUpdate) => Promise<ModelDevice | null>;
	getAll: () => Promise<(ModelDevice & { brand: Brand; Comment: Comment[] })[]>;
	setBrandOnSecondCategory: (setBrands: setSecondCategoryOnBrand) => Promise<SecondLevelCategory>;
	setCategoryOnBrand: (setCategoryOnBrand: setBrandsOnCategory) => Promise<Brand>;
	getByFirstCategory: (firstCategory: string) => Promise<SecondLevelCategory[] | null>;
	setSecondCategory: (
		name: string,
		firstLevelId: string,
		alias: string,
	) => Promise<SecondLevelCategory | null>;
	findProducts: (brandId: string) => Promise<ModelDevice[] | null>;
	getCategory: () => Promise<FirstLevelCategory[] | null>;
	getBrands: () => Promise<Brand[]>;
	getProductByBrandSecondCategory: (
		secondLevelId: string,
		brandId: string,
	) => Promise<ModelDevice[] | null>;
	saveFile: (files: MFile[], productId: string) => Promise<ModelDevice | null>;
	getBrandProductByCategory: (secondLevelId: string) => Promise<Brand[]>;
}
