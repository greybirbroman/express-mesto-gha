const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const { SERVER_ERROR } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use(bodyParser.json());
// Для приема веб-страниц внутри POST запроса
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(requestLogger); // Подключаем логер запросов

app.use(routes);

app.use(errorLogger); // Подключаем логер ошибок
app.use(errors()); // Оброботчик ошибок Celebrate

// Централизованная обработка ошибок

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next(err);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
