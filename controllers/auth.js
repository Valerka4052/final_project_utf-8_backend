const { User } = require("../models/user");
const { funcWrapper, HttpError } = require("../helpers");

const register = async (req, res) => {
  // const { email, password } = req.body;
  const NewUser = await User.create(req.body);
  res.json({
    email: NewUser.email,
    name: NewUser.name,
  });
  // const user = await User.findOne({ email });

  // if (user) {
  //   throw HttpError(409, "Email in use");
  // }

  // const hashPassword = await bcrypt.hash(password, 10);
  // const newUser = await User.create({ ...req.body, password: hashPassword });

  // res.status(201).json({
  //   user: {
  //     email: newUser.email,
  //     subscription: newUser.subscription,
  //   },
  // });
};

module.exports = {
  register: funcWrapper(register),
  // login: ctrlWrapper(login),
  // getCurrent: ctrlWrapper(getCurrent),
  // logout: ctrlWrapper(logout),
  // updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
};
