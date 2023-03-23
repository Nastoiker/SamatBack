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
	Product,
	SecondLevelCategory,
	Comment, Tag,
} from '@prisma/client';
import { FileElementResponse } from '../files/dto/fileElement.response';
import { MFile } from '../files/mfile.class';

export interface IProductService {
	create: (product: ProductCreate) => Promise<Product | null>;
	createModel: (model: ModelDeviceDto) => Promise<ModelDevice | null>;
	createBrand: (brand: BrandDevice) => Promise<Brand | null>;
	findLikeSqlModelBrand: (searchByWorld: string) => Promise<Product[] | null>;

	find: (name: string) => Promise<Product | null>;
	findByAlias: (alias: string) => Promise<Product | null>;
	getById: (id: string) => Promise<Product | null>;
	delete: (id: string) => Promise<Product | null>;
	update: (product: ProductUpdate) => Promise<Product | null>;
	getAll: () => Promise<(ModelDevice & { brand: Brand; Comment: Comment[] })[]>;
	getModelBrandId: (product: ProductCreate) => Promise<{
		brandId: string | undefined;
		modelDeviceId: string | undefined;
		name: string;
		price: number;
		oldPrice?: number | undefined;
		TagId: string | undefined;
	}>;
	setBrandOnSecondCategory: (setBrands: setSecondCategoryOnBrand) => Promise<SecondLevelCategory>;
	setCategoryOnBrand: (setCategoryOnBrand: setBrandsOnCategory) => Promise<Brand>;
	getByFirstCategory: (firstCategory: string) => Promise<SecondLevelCategory[] | null>;
	setSecondCategory: (
		name: string,
		firstLevelId: string,
		alias: string,
	) => Promise<SecondLevelCategory | null>;
	findProducts: (brandId: string) => Promise<Product[] | null>;
	getCategory: () => Promise<FirstLevelCategory[] | null>;
	getBrands: () => Promise<Brand[]>;
	getProductByBrandSecondCategory: (
		secondLevelId: string,
		brandId: string,
	) => Promise<ModelDevice[] | null>;
	saveFile: (files: MFile[], productId: string) => Promise<Product | null>;
	getBrandProductByCategory: (secondLevelId: string) => Promise<Brand[]>;
	getProductsDiscount: () => Promise<Product[]>;
	getTags: () => Promise<Tag[]>;
}
