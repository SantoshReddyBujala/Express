const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromise = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");
const handleNewUSer = async (request, response) => {
  const { user, pwd } = request.body;
  if (!user || !pwd)
    return response
      .status(400)
      .json({ message: "Username and Password are requlired" });
  //Check the duplicate username in DB
  const duplicate = usersDB.users.find((person) => person.username == user);
  if (duplicate) return response.status(409); // Conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { username: user, password: hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromise.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.users);
    response.status(201).json({ success: `User Created ${user}` });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUSer };
