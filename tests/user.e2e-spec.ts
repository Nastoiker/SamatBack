import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';
let Application: App;
beforeAll(async () => {
	const { app } = await boot;
	Application = app;
});
describe('User-e2e', () => {
	it('Register-error', async () => {
		const res = await request(Application.app)
			.post('/users/register')
			.send({ email: 'damur@gmail.com', password: '1' });
		expect(res.statusCode).toBe(422);
	});
	it('Login-error', async () => {
		const res = await request(Application.app)
			.post('/users/login')
			.send({ email: 'damur@gmail.com', password: '1' });
		expect(res.statusCode).toBe(401);
	});
	it('Login-succes', async () => {
		const res = await request(Application.app)
			.post('/users/login')
			.send({ email: 'samat@gmail.com', password: 'daun' });
		expect(res.body.jwt).not.toBeUndefined();
	});
	it('Info-succes', async () => {
		const login = await request(Application.app)
			.post('/users/login')
			.send({ email: 'samat@gmail.com', password: 'daun' });
		const jwtToken = await request(Application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(jwtToken.body.email).toBe('samat@gmail.com');
	});
});
