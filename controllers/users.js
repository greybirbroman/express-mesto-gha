const User = require('../models/user');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send({ data: users }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
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
    .then((user) => res.status(STATUS_OK).send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.create(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.status(STATUS_CREATED).send({ data: user }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};
