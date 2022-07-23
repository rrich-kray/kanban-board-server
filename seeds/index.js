const sequelize = require('../config/connection');
const seedTasks = require('./task-seeds');
const seedBoards = require('./board-seeds');
const seedUsers = require('./user-seeds');

const seedAll = async () => {
	await sequelize.sync({ force: true });

	await seedUsers();
	console.log('\n----------USERS SEEDED----------\n');

	await seedBoards();
	console.log('\n----------BOARDS SEEDED----------\n');

	await seedTasks();
	console.log('\n----------TASKS SEEDED----------\n');

	process.exit(0);
};

seedAll();
