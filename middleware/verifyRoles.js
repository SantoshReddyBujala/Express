const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArrary = [...allowedRoles];
    console.log(rolesArrary);
    console.log(req.roles);
    const result = req.roles
      .map((role) => rolesArrary.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
