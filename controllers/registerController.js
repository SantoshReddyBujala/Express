const User = require("../model/User");
const bcrypt = require("bcrypt");
const handleNewUSer = async (request, response) => {
  const { user, pwd } = request.body;
  if (!user || !pwd)
    return response
      .status(400)
      .json({ message: "Username and Password are requlired" });
  //Check the duplicate username in DB
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return response.sendStatus(409); // Conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    console.log(result)
    response.status(201).json({ success: `User Created ${user}` });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
};
module.exports = { handleNewUSer };
