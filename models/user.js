const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
    minlength: 2,
    maxlength: 30,
    default: 'Roman',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Fedorov',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

module.exports = mongoose.model('user', userSchema);
