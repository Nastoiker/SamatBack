import { compare, hash } from 'bcryptjs';
export class User {
	private _password!: string;
	constructor(
		private readonly _email: string,
		private readonly _login: string,
		private passwordH?: string,
	) {
		if (passwordH) {
			this.passwordH = passwordH;
		}
	}

	get login(): string {
		return this._login;
	}
	get email(): string {
		return this._email;
	}
	get hashpassword(): string {
		return this._password;
	}
	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}
	public async comparePassword(comparePassword: string): Promise<boolean> {
		return compare(comparePassword, <string>this.passwordH);
	}
}
