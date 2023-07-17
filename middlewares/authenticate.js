const jwt = require("jsonwebtoken");
SECRET_KEY = '{nYf}?:U,PI/^4>Pb"Qw`fa`oS2J1D';
ACCESS_SECRET_KEY = "N_PegFHRrarax*P";
const { User } = require("../models/user");
const { HttpError } = require("../helpers");

const authenticate = async (req, res, next) => {
  const { authorization = " " } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.accessToken) {
      next(HttpError(401, "Not authorized"));
    }

    req.user = user;

    next();
  } catch {
    next(HttpError(401, "Not authorized"));
  }
};
module.exports = authenticate;
