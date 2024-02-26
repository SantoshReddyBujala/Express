const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and Password are requlired" });
  const foundUser = usersDB.users.find((person) => person.username === user);
  if (!foundUser) return res.sendStatus(401); // Unauthorized
  //evaluate user
  const match = await bcrypt.compare(pwd, foundUser.password);
  try {
    if (match) {
      //create JWTs
      res.json({ success: `User logged in successfuly ${user}` });
    } else {
      //console.log("Hitting here")
      res.sendStatus(401);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = { handleLogin };
