import { IMiddleware } from './middlewares.interface';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
export class MulterMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		const storage = multer.memoryStorage();
		// {
		// 	destination: './uploads/',
		// 	filename: (req, file, cb) => {
		// 		cb(null, file.originalname);
		// 		// req.file = file;
		// 		if(!file.buffer) console.log(file);
		// 		// req.file.buffer = file.buffer;
		// 	},
		// }
		const upload = multer({ storage }).single('files');
		try {
			upload(req, res, (err) => {
				console.log('1' + req.file?.originalname);
				if (err) {
					throw new Error('1 error');
				} else {
					next();
				}
			});
		} catch {
			res.status(400).send({ error: 'asdasdasdasd' });
		}
	}
}
