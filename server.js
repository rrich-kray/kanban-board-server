const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");
const routes = require("./routes/apiRoutes");
const sequelize = require("./config/connection");
const path = require("path");

// appears that you must specify cors middleware for server prior to routes?
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://kanban-board-client-rrich.herokuapp.com",
//     ],
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/build")));
// }

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
  });
});
