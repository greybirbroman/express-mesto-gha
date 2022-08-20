const Card = require('../models/card');

const {
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE,
  FOUND_ERROR_CODE,
  SERVER_ERROR,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: `${ERROR_CODE} - Передан не корректный ID: ${err}` });
        return;
      }
      res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(FOUND_ERROR_CODE).send({ message: `${FOUND_ERROR_CODE} - Карточки с таким ID не существует` });
        return;
      }
      res.status(STATUS_OK).send({ data: card })
        .catch((err) => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(FOUND_ERROR_CODE).send({ message: `${FOUND_ERROR_CODE} - Карточки с таким ID не существует` });
        return;
      }
      res.status(STATUS_OK).send({ data: card })
        .catch((err) => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(FOUND_ERROR_CODE).send({ message: `${FOUND_ERROR_CODE} - Карточки с таким ID не существует` });
        return;
      }
      res.status(STATUS_OK).send({ data: card })
        .catch((err) => res.status(SERVER_ERROR).send({ message: `${SERVER_ERROR} - Произошла ошибка на сервере - ${err}` }));
    });
};
