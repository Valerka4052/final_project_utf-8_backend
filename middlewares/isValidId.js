const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers/HttpError');

const isValid = (req, res, next) => {
    if (!isValidObjectId(req.params.id)) next(HttpError(400, `${req.params.id} is not valid id`));
    next()
};
const isValidIdByReqBody = (req, res, next) => {
    if (!isValidObjectId(req.body.id)) next(HttpError(400, `${req.params.id} is not valid id`));
    next()
};
module.exports = { isValid, isValidIdByReqBody };