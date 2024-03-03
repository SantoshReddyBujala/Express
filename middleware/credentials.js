const allowedOrigins = require("../config/allowedOrigins");
const credentials = (req, res, next) => {
  const orgin = req.headers.orgin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Creadentials", true);
  }
  next();
};

module.exports = credentials;
