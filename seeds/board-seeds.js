const Board = require('../models/Board');

const boardData = [
	{
		name: 'Kanban Board',
		user_id: 1,
	},
	{
		name: 'Space Exploration Website',
		user_id: 2,
	},
	{
		name: 'Interactive Comments Section',
		user_id: 3,
	},
	{
		name: 'MERN Social Media App',
		user_id: 4,
	},
	{
		name: 'MERN Blog',
		user_id: 5,
	},
];

const seedBoards = () => Board.bulkCreate(boardData);

module.exports = seedBoards;
