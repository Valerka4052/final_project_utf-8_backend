const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const gravatar = require("gravatar");

const { nanoid } = require("nanoid");
const { User } = require("../models/user");
const {
  funcWrapper,
  HttpError,
  sendEmail,
  emailTextRegister,
} = require("../helpers");
require("dotenv").config();
const { SECRET_KEY, ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, BASE_URL } =
  process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && !user.verify) {
    throw HttpError(408, "Please check your email inbox.");
  } else if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(
    email,
    { s: "100", r: "x", d: "wavatar" },
    false
  );
  const verificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationCode,
  });
  const { _id } = newUser;

  const payload = {
    id: _id,
  };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  const updatedUser = await User.findByIdAndUpdate(_id, {
    accessToken,
    refreshToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verified email",
    html: emailTextRegister(verificationCode),
  };
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "token invalid");
    }
    const payload = {
      id,
    };
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "2m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7d",
    });

    await User.findByIdAndUpdate(id, { accessToken, refreshToken });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationCode } = req.params;
  const user = await User.findOne({ verificationCode });

  if (!user) {
    throw HttpError(404, "user not found");
  }
  const { accessToken, refreshToken } = user;
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationCode: "",
  });

  res.status(200).json({
    accessToken,
    refreshToken,
    message: "verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const { verificationCode } = user;

  if (!user) {
    throw HttpError(404, "user not found");
  }
  if (user.verify) {
    throw HttpError(409, "verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: " Resend verify email",
    html: emailTextRegister(verificationCode),
  };
  await sendEmail(verifyEmail);
  res.status(200).json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(403, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(404, "user not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(403, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });
  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name, avatarURL } = req.user;

  res.status(200).json({ email, name, avatarURL });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });
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
    const { path } = req.file;

    const updatedUser = await User.findByIdAndUpdate(_id, { avatarURL: path });
    res.status(200).json({ avatarURL: path });
  } else {
    const { path } = req.file;

    const updatedUser = await User.findByIdAndUpdate(_id, {
      avatarURL: path,
      name,
    });
    res.status(200).json({ avatarURL: path, name: name });
  }
};
const googleAuth = async (req, res) => {
  const { _id: id } = req.user;
  const payload = {
    id,
  };

  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  await User.findByIdAndUpdate(id, { accessToken, refreshToken });

  res.redirect(
    `https://villiav.github.io/final_project_utf-8_front/?accessToken=${accessToken}&refreshToken=${refreshToken}`
  );
};

module.exports = {
  register: funcWrapper(register),
  login: funcWrapper(login),
  getCurrent: funcWrapper(getCurrent),
  logout: funcWrapper(logout),
  updateUser: funcWrapper(updateUser),
  refresh: funcWrapper(refresh),
  googleAuth: funcWrapper(googleAuth),

  verifyEmail: funcWrapper(verifyEmail),
  resendVerifyEmail: funcWrapper(resendVerifyEmail),
};
