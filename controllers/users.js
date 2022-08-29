const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  FOUND_ERROR_CODE,
  SERVER_ERROR,
  ERROR_CODE,
  UNAUTORIZED_ERROR,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(FOUND_ERROR_CODE).send({ message: `${FOUND_ERROR_CODE} - Запрашиваемый пользователь не найден` });
        return;
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Передан не корректный ID` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере` });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        if (user) {
          res.status(409).send({ message: 'Такой пользователь уже существует' });
        }
        res.status(STATUS_CREATED).send({ data: user });
      }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе создания пользователя` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере` });
    });
};

module.exports.login = (req, res) => {
  const {
    email, password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(UNAUTORIZED_ERROR).send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports.updateProfile = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе обновления пользователя` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере` });
    });
};

module.exports.updateAvatar = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе обновления аватара` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: ` ${SERVER_ERROR} - Произошла ошибка на сервере` });
    });
};
