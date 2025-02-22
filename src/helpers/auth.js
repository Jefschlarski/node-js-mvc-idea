import bcrypt from "bcryptjs";

export const checkAuth = (req, res, next) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect("/login");
  }

  next();
};

export const checkPermission = (req, res, next) => {
  const userType = req.session.userType;
  if (userType != "admin" && userType != "root") {
    return res.redirect("/idea");
  }

  next();
};

export const hashPassword = (password, salt) => {
  if (!salt) {
    salt = bcrypt.genSaltSync(10);
  }
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const checkPassword = (password, hashedPassword) => {
  const passwordMatch = bcrypt.compareSync(password, hashedPassword);
  return passwordMatch;
};
