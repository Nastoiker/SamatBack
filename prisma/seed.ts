import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const brand: Prisma.BrandCreateInput[] = [
	{
		name: 'Xiaomi',
	},
	{
		name: 'Lenovo',
	},
	{
		name: 'OPPO',
	},
	{
		name: 'Apple',
	},
	{
		name: 'Samsung',
	},
];
const tag: Prisma.TagCreateInput[] = [
	{
		name: 'Популярные',
	},
	{
		name: 'Дешевые',
	},
	{
		name: 'Беспроводные',
	},
	{
		name: 'Скидка',
	},
	{
		name: 'Новые',
	},
	{
		name: 'Флагманы',
	},
];
// const model: Prisma.ModelDeviceCreateInput[] = [
// 	{
// 		name: 'airDots',
// 		secondCategoryId: ''
// 		brandId: '',
// 	},
// 	{
// 		name: 'LP40',
// 		secondCategoryId: ''
// 		brandId: '',
// 	},
// 	{
// 		name: 'ENCO AIR 2',
// 		secondCategoryId: ''
// 		brandId: '',
// 	},
// 	{
// 		name: 'airpods pro',
// 		secondCategoryId: ''
// 		brandId: '',
// 	},
// 	{
// 		name: 'EHS64',
// 		secondCategoryId: ''
// 		brandId: '',
// 	},
// ];
const firrtCategory: Prisma.FirstLevelCategoryCreateInput[] = [
	{
		name: 'Техника',
		alias: 'technology',
	},
	{
		name: 'Книги',
		alias: 'books',
	},
	{
		name: 'Блоги',
		alias: 'blogs',
	},
];
const userData = [brand, tag, firrtCategory];

// const SecondCategory: Prisma.SecondLevelCategoryCreateInput[] = [
// 	{
// 		name: 'Наушники',
// 		alias: 'headphones',
// 		firstLevelId: '4d2f0720-d963-4ff4-8c95-8a4e111da430',
// 	},
// 	{
// 		name: 'Повербанк',
// 		alias: 'powerbank',
// 		firstLevelId: '4d2f0720-d963-4ff4-8c95-8a4e111da430',
// 	},
// 	{
// 		name: 'Телефоны',
// 		alias: '',
// 		firstLevelId: '4d2f0720-d963-4ff4-8c95-8a4e111da430',
// 	},
// ];
// const userData: Prisma.SecondLevelCategoryCreateInput[] = [
// 	{
// 		id: 'Наушники',
// 		firstLevelId: 1,
// 	},
// 	{
// 		id: 'Повербанк',
// 		firstLevelId: 1
// 	},
// 	{
// 		id: 'Телефоны',
// 		firstLevelId: 1,
// 	},
// ];c

async function main() {
	console.log(`Start seeding ...`);
	// for (const u of tag) {
	// 	const user = await prisma.tag.create({
	// 		data: u,
	// 	});
	// 	console.log(`Created user with id: ${user.id}`);
	// }
	// await prisma.userModel.update({
	// 	where: { id: '35879279-421b-4272-8496-c7cdd5aec715' },
	// 	data: {
	// 		isActive: false,
	// 	},
	// });
	await prisma.product.deleteMany({});
	// await prisma.secondLevelCategory.deleteMany({});
	console.log(`Seeding finished.`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
