const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},

		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		timestamps: true,
		underscored: true,
		freezeTableName: true,
		modelName: 'user',
	}
);

// User.beforeCreate((user, options) => {
// 	const hashedPassword = bcrypt.hash(user.password);
// 	user.password = hashedPassword;
// });

module.exports = User;
