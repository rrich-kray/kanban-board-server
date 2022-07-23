const { Board } = require('../models/index');
const { Task } = require('../models/index');
const User = require('../models/User');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// Get all tasks
router.get('/kanban-board-full-stack/api/tasks', async (req, res) => {
	Task.findAll()
		.then((taskData) => {
			// retreiving data from model
			res.json(taskData);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Get boards by user
router.get('/kanban-board-full-stack/api/boards/:userId', async (req, res) => {
	Board.findAll({
		where: {
			user_id: req.params.userId,
		},
		include: [
			{
				model: Task,
			},
		],
	})
		.then((response) => {
			res.json(response);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Get boards
router.get('/kanban-board-full-stack/api/boards', async (req, res) => {
	Board.findAll({
		include: [
			{
				model: Task,
			},
		],
	})
		.then((boardData) => {
			console.log(boardData);
			res.json(boardData);
		})
		.catch((error) => {
			res.json(error);
		});
});

// Create a task
router.post('/kanban-board-full-stack/api/tasks', async (req, res) => {
	console.log(req.body);
	Task.create(req.body)
		.then((response) => {
			res.json(response);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Create a board
router.post('/kanban-board-full-stack/api/boards', async (req, res) => {
	Board.create(req.body)
		.then((response) => {
			res.json(response);
		})
		.catch((err) => {
			console.log(err);
		});
});

// Update a task
router.put('/kanban-board-full-stack/api/tasks', async (req, res) => {
	Task.update(req.body, {
		where: {
			id: req.body.task_id,
		},
	})
		.then((response) => {
			res.json(response);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Delete a task
router.delete('/kanban-board-full-stack/api/tasks', async (req, res) => {
	Task.destroy({
		where: {
			id: req.body.task_id,
		},
	})
		.then((response) => {
			res.json(response);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Delete a board
router.delete('/kanban-board-full-stack/api/boards', async (req, res) => {
	Task.destroy({
		where: {
			board_id: req.body.id,
		},
	});

	await Board.destroy({
		where: {
			id: req.body.id,
		},
	})
		.then((boardData) => {
			res.json(boardData);
		})
		.catch((err) => {
			res.json(err);
		});
});

// Register
router.post('/kanban-board-full-stack/api/register', async (req, res) => {
	User.create(req.body) // This will be formState object.
		.then((userData) => {
			const token = jwt.sign(
				{
					data: [
						userData.firstName,
						userData.lastName,
						userData.email,
						userData.password,
					],
				},
				secret,
				{ expiresIn: '2h' }
			);
			res.json({
				user: userData,
				token: token
			});
		})
		.catch((err) => res.json(err));
});

// Login
router.post('/kanban-board-full-stack/login', async (req, res) => {
	User.findOne({
		where: {
			id: req.body.id,
			password: req.body.password,
		},
	})
		.then((userData) => {
			const token = jwt.sign(
				{
					data: [
						userData.email,
						userData.password
					]
				},
				secret,
				{expiresIn: '2h'}
			)
			res.json({
				user: userData,
				token: token
			});
		})
		.catch((err) => {
			res.json(err);
		});
});

module.exports = router;
