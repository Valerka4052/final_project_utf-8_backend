require("dotenv").config();
const { GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, BASE_URL } = process.env;
const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/users/google/callback`,
  passReqToCallback: true,
};

const googleCallback = async (
  req,
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    const { email, displayName, picture } = profile;
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user); //req.user = user
    }

    const password = await bcrypt.hash(nanoid(), 10);
    const avatarURL = picture;
    const verificationCode = "null";
    const verify = true;

    const newUser = await User.create({
      email,
      password,
      name: displayName,
      avatarURL,
      verificationCode,
      verify,
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use("google", googleStrategy);

module.exports = passport;
