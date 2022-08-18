const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const routes = require("./routes/apiRoutes");
const sequelize = require("./config/connection");
const path = require("path");
const session = require("express-session");

// appears that you must specify cors middleware for server prior to routes?
app.use(
  cors({
    origin: [
      "https://kanban-board-client-rrich.herokuapp.com",
      "https://kanban-board-client-rrich.herokuapp.com/register",
      "https://kanban-board-client-rrich.herokuapp.com/login",
      "https://kanban-board-client-rrich.herokuapp.com/dashboard",
      "http://localhost:3000",
      "https://kanban-board-lyart.vercel.app/register",
      "https://kanban-board-lyart.vercel.app/login",
      "https://kanban-board-lyart.vercel.app",
    ],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
  });
});
