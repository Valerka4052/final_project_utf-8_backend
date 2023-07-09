const { HttpError } = require("../helpers");

const validateBodyPost = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    const bodyLength = Object.keys(req.body).length;

    if (bodyLength === 0) {
      throw HttpError(400, "missing fields");
    }
    if (error) {
      const errorMesagge =
        error.message
          .split("is required")
          .join("")
          .split('"')
          .join("")
          .split(",")
          .toString() || "";

      next(HttpError(400, ` missing required ${errorMesagge} field`));
    }
    next();
  };
  return func;
};

const validated = (shema) => {
    const func = (req, res, next) => {
        const { error } = shema.validate(req.body);
        if (error) next(HttpError(400, error.message));
        next();
    };
    return func;
};

const validateUsersPatch = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, "missing field subscription"));
    }
    next();
  };
  return func;
};

module.exports = {
  validateBodyPost,
validated,
  validateUsersPatch,
};
