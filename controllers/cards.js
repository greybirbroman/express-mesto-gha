const Card = require('../models/card');

const STATUS_OK = 200;
const STATUS_CREATED = 201;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.status(STATUS_OK).send({ data: card }))
    .catch((err) => res.status(SERVER_ERROR).send({ message: `Произошла ошибка на сервере ${err}` }));
};
