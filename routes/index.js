const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const notFoundRouter = require('./not-found');

router.use(usersRouter, cardsRouter, notFoundRouter);

module.exports = router;
