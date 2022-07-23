const Board = require('./Board');
const Task = require('./Task');
const User = require('./User');

User.hasMany(Board, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
});

Board.belongsTo(User, {
	foreignKey: 'user_id',
});

Board.hasMany(Task, {
	foreignKey: 'board_id',
	onDelete: 'CASCADE',
});

Task.belongsTo(Board, {
	foreignKey: 'board_id',
	onDelete: 'CASCADE',
});

module.exports = { Board, Task };
