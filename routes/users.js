const router = require('express').Router();
const auth = require('../middlewares/auth');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUserById);
router.patch('/users/me', auth, updateProfile);
router.patch('/users/me/avatar', auth, updateAvatar);

module.exports = router;
