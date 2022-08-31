const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');

const {
  getUsers,
  updateProfile,
  updateAvatar,
  getProfile,
} = require('../controllers/users');

router.get('/users', auth, getUsers);

router.get('/users/me', auth, getProfile);

router.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(2).min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www)?[\-\.~:\/\?#\[\]@!$&'\(\)*\+,;=\w]+#?\b/),
  }),
}), updateAvatar);

module.exports = router;
