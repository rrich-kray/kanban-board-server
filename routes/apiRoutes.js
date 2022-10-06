const { Board } = require("../models/index");
const { Task } = require("../models/index");
const User = require("../models/User");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const secret = process.env.SECRET;
const { Validator, verifyToken } = require("../utils/validator");
const { response } = require("express");

// Get all tasks
router.get(
  "/kanban-board-full-stack/api/tasks",
  verifyToken,
  async (req, res) => {
    Task.findAll()
      .then((taskData) => {
        // retreiving data from model
        res.json(taskData);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// Get boards by user
router.get(
  "/kanban-board-full-stack/api/boards/userBoards",
  verifyToken,
  (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    Board.findAll({
      where: {
        user_id: jwt_decode(token).data[0],
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
router.get(
  "/kanban-board-full-stack/api/boards",
  verifyToken,
  async (req, res) => {
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
  }
);

// Create a task
router.post(
  "/kanban-board-full-stack/api/tasks",
  verifyToken,
  async (req, res) => {
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
  }
);

// Create a board
router.post(
  "/kanban-board-full-stack/api/boards",
  verifyToken,
  async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    Board.create({
      name: req.body.name,
      user_id: jwt_decode(token).data[0],
    })
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

// Update a task
router.put(
  "/kanban-board-full-stack/api/tasks",
  verifyToken,
  async (req, res) => {
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
  }
);

// Delete a task
router.delete(
  "/kanban-board-full-stack/api/tasks",
  verifyToken,
  async (req, res) => {
    await Task.destroy({
      where: {
        id: req.body.task_id,
      },
    })
      .then((response) => {
        if (response.ok()) {
          res.json({ message: "Task successfully deleted" });
        }
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

// Delete a board
router.delete("/kanban-board-full-stack/api/boards", (req, res) => {
  if (!req.body.board_id) {
    res.send({ errorMessage: "Invalid board id provided" });
    return;
  }

  Task.destroy({
    where: {
      board_id: req.body.board_id,
    },
  });

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
router.post(
  "/kanban-board-full-stack/api/register",
  new Validator("email").validateEmail,
  new Validator("password").isLength,
  async (req, res) => {
    const userData = await User.create(req.body);

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
  },

  // verify token
  router.get("/kanban-board-full-stack/api/verify", verifyToken, (req, res) => {
    res.json({ verified: true });
  })
);

module.exports = router;
