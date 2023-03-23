import { Product } from '@prisma/client';
import { ProductCreate } from './dto/create-product.dto';
import { NextFunction, Request, Response } from 'express';

export interface IProductController {
	create: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	find: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
