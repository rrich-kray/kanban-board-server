const { Board } = require("../models/index");
const { Task } = require("../models/index");
const User = require("../models/User");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authenticate = require("../utils/middleware");
const secret = process.env.SECRET;
const { Validator } = require("../utils/validator");
const { response } = require("express");

// Get all tasks
router.get("/kanban-board-full-stack/api/tasks", async (req, res) => {
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
// Route can only be accessed if req.session exists. If so, the the user_id from req.session will be used to filter boards
router.get(
  "/kanban-board-full-stack/api/boards/:userId",
  authenticate,
  (req, res) => {
    Board.findAll({
      where: {
        user_id: req.session.user_id,
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
  }
);

// Get boards
router.get("/kanban-board-full-stack/api/boards", async (req, res) => {
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
router.post("/kanban-board-full-stack/api/tasks", async (req, res) => {
  Task.create({
    title: req.body.title,
    description: req.body.description,
    progress: req.body.progress,
    board_id: req.body.board_id,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Create a board
router.post("/kanban-board-full-stack/api/boards", async (req, res) => {
  Board.create({
    name: req.body.name,
    user_id: req.body.user_id,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update a task
router.put("/kanban-board-full-stack/api/tasks", async (req, res) => {
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
router.delete("/kanban-board-full-stack/api/tasks", async (req, res) => {
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
router.delete("/kanban-board-full-stack/api/boards", (req, res) => {
  // Task.destroy({
  //   where: {
  //     board_id: req.body.board_id,
  //   },
  // });

  Board.destroy({
    where: {
      id: req.body.board_id,
    },
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Register
router.post("/kanban-board-full-stack/api/register", (req, res) => {
  User.create(req.body)
    .then((userData) => {
      const token = jwt.sign(
        {
          data: [userData.id, userData.email],
        },
        secret,
        { expiresIn: "2h" }
      );
      res.json({ user: userData, token: token });
    })
    .catch((err) => res.json(err));
});

// Login
router.post(
  "/kanban-board-full-stack/api/login",
  new Validator("email").validateEmail,
  async (req, res) => {
    const userData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userData || userData?.password !== req.body.password) {
      res.json({ errorMessage: "Invalid user credentials provided." });
      return;
    }

    const token = jwt.sign(
      {
        data: [userData.id, userData.email],
      },
      secret,
      { expiresIn: "2h" }
    );
    res.json({ user: userData, token: token });
  }
);

// Logout
router.post("/kanban-board-full-stack/api/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
