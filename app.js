const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { FOUND_ERROR_CODE } = require('./utils/constants');
const { createUser, login } = require('./controllers/users');

const app = express();

app.use(helmet());

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '630368988bdfdef3c2cfbc75',
  };
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(routes);

// Обработать неправильный путь
app.use((req, res) => {
  res.status(FOUND_ERROR_CODE).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
