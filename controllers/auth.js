const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models/user");
const { funcWrapper, HttpError } = require("../helpers");

SECRET_KEY = '{nYf}?:U,PI/^4>Pb"Qw`fa`oS2J1D';

const avatarsDir = path.join(__dirname, "../public/avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });
  const { _id } = newUser;
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  const updatedUser = await User.findByIdAndUpdate(_id, { token });

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
      shoppingList: newUser.shoppingList,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
      shoppingList: user.shoppingList,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  console.log(req.user);
  res.status(200).json({
    email: email,
    name: name,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const name = req.body.name || req.user.name;
  const bodyLength = Object.keys(req.body).length;

  if (!req.file) {
    await User.findByIdAndUpdate(_id, { name });
    res.json({ name });
  } else if (bodyLength === 0) {
    // const { path: tempUpload, originalname } = req.file;
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsDir, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarURL = path.join("avatars", filename);
    //     await User.findByIdAndUpdate(_id, { avatarURL });
    // res.json({ avatarURL });
    const { path } = req.file;
    const updatedUser = await User.findByIdAndUpdate(_id, { avatarURL:path });
    res.json({ avatarURL: updatedUser.avatarURL });
  } else {
    // const { path: tempUpload, originalname } = req.file;
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsDir, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarURL = path.join("avatars", filename);
    // await User.findByIdAndUpdate(_id, { avatarURL, name });
    // res.json({ avatarURL, name });
    const { path } = req.file;
    const updatedUser = await User.findByIdAndUpdate(_id, { avatarURL: path, name });
    res.json({ avatarURL: updatedUser.avatarURL, name: updatedUser.name });
  }
};

module.exports = {
  register: funcWrapper(register),
  login: funcWrapper(login),
  getCurrent: funcWrapper(getCurrent),
  logout: funcWrapper(logout),
  updateUser: funcWrapper(updateUser),
};
