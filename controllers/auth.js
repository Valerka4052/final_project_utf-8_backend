const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { User } = require("../models/user");
const { funcWrapper, HttpError, sendEmail } = require("../helpers");

SECRET_KEY = '{nYf}?:U,PI/^4>Pb"Qw`fa`oS2J1D';

const avatarsDir = path.join(__dirname, "../public/avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(
    email,
    { s: "100", r: "x", d: "wavatar" },
    false
  );
  // const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  const { _id } = newUser;
  const payload = {
    id: _id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  const updatedUser = await User.findByIdAndUpdate(_id, { token });

  // const verifyEmail = {
  //   to: email,
  //   subject: "Verified email",
  //   html: ` <a
  //       target="_blank"
  //       href="http://localhost:3001/users/verify/${verificationCode}"
  //     >
  //       Click verify email
  //     </a>`,
  // };
  // await sendEmail(verifyEmail);

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    },
  });
};

// const verifyEmail = async (req, res) => {
//   const { verificationCode } = req.params;
//   const user = await User.findOne({ verificationCode });
//   if (!user) {
//     throw HttpError(404, "User not found");
//   }
//   await User.findByIdAndUpdate(user._id, {
//     verify: true,
//     verificationCode: "",
//   });
//   res.status(200).json({ message: "Verification successful" });
// };

// const resendVerifyEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw HttpError(404, "User not found");
//   }
//   if (user.verify) {
//     throw HttpError(400, "Verification has already been passed");
//   }

//   const verifyEmail = {
//     to: email,
//     subject: "Verify Cemailode",
//     html: `<a target='_blank' href="http://localhost:3001/users/verify/${user.verificationCode}">Click verify email</a>`,
//   };
//   await sendMail(verifyEmail);
//   res.status(200).json({ message: "Verification email sent" });
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  // if (!user.verify) {
  //   throw HttpError(404, "User not found");
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1m" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name, shoppingList, avatarURL } = req.user;

  res.status(200).json({ email, name, avatarURL });
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
    res.status(200).json({ name });
  } else if (bodyLength === 0) {
    // const { path: tempUpload, originalname } = req.file;
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsDir, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarURL = path.join("avatars", filename);
    //     await User.findByIdAndUpdate(_id, { avatarURL });
    // res.json({ avatarURL });
    const { path } = req.file;

    const updatedUser = await User.findByIdAndUpdate(_id, { avatarURL: path });
    res.status(200).json({ avatarURL: path });
  } else {
    // const { path: tempUpload, originalname } = req.file;
    // const filename = `${_id}_${originalname}`;
    // const resultUpload = path.join(avatarsDir, filename);
    // await fs.rename(tempUpload, resultUpload);
    // const avatarURL = path.join("avatars", filename);
    // await User.findByIdAndUpdate(_id, { avatarURL, name });
    // res.json({ avatarURL, name });
    const { path } = req.file;

    const updatedUser = await User.findByIdAndUpdate(_id, {
      avatarURL: path,
      name,
    });
    res
      .status(200)
      .json({ avatarURL: updatedUser.avatarURL, name: updatedUser.name });
  }
};

module.exports = {
  register: funcWrapper(register),
  login: funcWrapper(login),
  getCurrent: funcWrapper(getCurrent),
  logout: funcWrapper(logout),
  updateUser: funcWrapper(updateUser),
  // verifyEmail: funcWrapper(verifyEmail),
  // resendVerifyEmail: funcWrapper(resendVerifyEmail),
};
