import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ProductRepository } from '../Product/product.repository';
import { AdminRepository } from './admin.repository';

@injectable()
export class AdminService {
	constructor(@inject(TYPES.AdminRepository) private adminRepository: AdminRepository) {}

	async deleteModel(id: string) {
		return this.adminRepository.deleteModel(id);
	}
	async deleteComment(commentId: string) {
		return this.adminRepository.deleteComment(commentId);
	}
}
