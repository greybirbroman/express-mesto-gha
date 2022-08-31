const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
const ExistError = require('../errors/exist-err');
const DataError = require('../errors/data-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Отсутствует почта или пароль!');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ExistError('Такой пользователь уже существует!');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.status(STATUS_CREATED).send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch(next);
};

module.exports.getProfile = (req, res, next) => User
  .findById(req.user._id).select('+password')
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    res.status(STATUS_OK).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    });
  })
  .catch(next);

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new DataError('Неправильные почта или пароль');
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  if (!name || !about) {
    res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе обновления пользователя` });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе обновления аватара` });
    return;
  }
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      res.status(STATUS_OK).send({ data: user });
    })
    .catch(next);
};
