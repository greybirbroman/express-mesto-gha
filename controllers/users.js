const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
  FOUND_ERROR_CODE,
  SERVER_ERROR,
  ERROR_CODE,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
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
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Передан не корректный ID: ${err}` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (!name || !about || !avatar) {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе создания пользователя - ${err}` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе создания пользователя - ${err}` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!name || !about) {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе создания пользователя` });
        return;
      }
      res.status(STATUS_OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Переданы некорректные данные в методе создания пользователя - ${err}` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: ` ${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
};
