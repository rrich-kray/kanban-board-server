const express = require("express");
const PORT = process.env.PORT || 3001;
// const { PORT, NODE_ENV } = require("./config");
const app = express();
const cors = require("cors");
const routes = require("./routes/apiRoutes");
const sequelize = require("./config/connection");
const path = require("path");
const session = require("express-session");
const connect = require("connect");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

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

// Why let people now that this is an Express app?
app.disable("x-powered-by");

// Will use MemoryStore by default, which is not suitable for production. It will leak memory under most instances.
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 60000,
      sameSite: true,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);
// Same site: true prevents CSRF attacks
// This session is only accesible on the server side

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
