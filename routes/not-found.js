const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.all('*', auth, () => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
