const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies?.jwt);
  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); // Unauthorized
  //evaluate user
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err || foundUser.username !== decode.username)
      return res.sendStatus(403);
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decode.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
