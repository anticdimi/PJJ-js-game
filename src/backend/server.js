const express = require('express');
const bodyParser = require('body-parser');
const DBController = require('./controllers/dbController');
const cors = require('cors');

const port = 8080;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

DBController.registerRoutes(app);

app.listen(port, () => console.log(`API is listening on port ${ port }!`));
