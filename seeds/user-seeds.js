const User = require('../models/User');

const userData = [
	{
		firstName: 'John',
		lastName: 'Smith',
		email: 'johnsmith@gmail.com',
		password: 'password',
	},
	{
		firstName: 'Joe',
		lastName: 'Smith',
		email: 'joesmith@gmail.com',
		password: 'password',
	},
	{
		firstName: 'Johnny',
		lastName: 'Smith',
		email: 'johnnysmith@gmail.com',
		password: 'password',
	},
	{
		firstName: 'James',
		lastName: 'Smith',
		email: 'jamessmith@gmail.com',
		password: 'password',
	},
	{
		firstName: 'Jimbo',
		lastName: 'Smith',
		email: 'jimbosmith@gmail.com',
		password: 'password',
	},
];

const seedUsers = () => User.bulkCreate(userData);
module.exports = seedUsers;
