const authenticate = (req, res) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.json("You must be logged in to perform this action.");
  }
};

module.exports = authenticate;
