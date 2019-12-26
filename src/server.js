const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors({origin: '*'}));

let highScores = [
    {
        id: 'nest',
        score: 'nesto'
    },
];

app.post('/api/save', async (req, res) => {
    const body = req.body;
    console.log(req.body);

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // TODO add to db
    highScores.push({ id: body.id, score: body.rightPlace });
    console.log(ip);

    res.send({ message: 'all good' });
});

app.get('/api/scores', async (req, res) => {
    // TODO read from db
    res.send(highScores);
});

app.listen(process.env.PORT || port, () => console.log(`Server is listening on port ${ port }!`));