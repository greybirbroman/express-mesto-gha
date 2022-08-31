const jwt = require('jsonwebtoken');
const UNAUTORIZED_ERROR = require('../utils/constants');
const DataError = require('../errors/data-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new DataError('Необходима авторизация!');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // Верификация токена
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(UNAUTORIZED_ERROR).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
