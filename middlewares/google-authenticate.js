GOOGLE_CLIENT_ID =
  "112833128024-emj448kcbhnbi8fcc28un9l3cl9mhmf5.apps.googleusercontent.com";
GOOGLE_CLIENT_SECRET = "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";
const passport = require("passport");
const { Strategy } = require("passport-google-oauth2");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const gravatar = require("gravatar");

const googleParams = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/users/google/callback",
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
    const { email, displayName } = profile;
    const user = await User.findOne({ email });
    if (user) {
      return done(null, user); //req.user = user
    }
    const password = await bcrypt.hash(nanoid(), 10);
    const avatarURL = gravatar.url(
      email,
      { s: "100", r: "x", d: "wavatar" },
      false
    );
    const newUser = await User.create({
      email,
      password,
      name: displayName,
      avatarURL,
    });
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
};

const googleStrategy = new Strategy(googleParams, googleCallback);

passport.use("google", googleStrategy);

module.exports = passport;
