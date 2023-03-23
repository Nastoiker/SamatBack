import { injectable } from 'inversify';
import sharp = require('sharp');
@injectable()
export class FileService {
	async convertToWebp(file: Buffer): Promise<Buffer> {
		return sharp(file).webp().toBuffer();
	}
}
