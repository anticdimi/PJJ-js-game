const MongoDBService = require('../services/mongoService');

class DBController {
    constructor(request, response) {
        this.request = request;
        this.response = response;

        this.mongoDBService = new MongoDBService('mongodb://localhost:27017',
            'UserScores');
    }

    static registerRoutes(app) {
        app.post('/api/save', async (req, res) => {
            await new DBController(req, res).postUsers();
        });

        app.get('/api/scores', async (req, res) => {
            await new DBController(req, res).getUsers();
        });
    }

    async getUsers() {
        try {
            await this.mongoDBService.connect();

            let users = await this.mongoDBService.find('users');

            this.mongoDBService.disconnect();

            users = users.slice(0, 10);
            users = users.sort((x, y) => x.score < y.score);
            users.forEach(x => {
                let buf = Buffer.from(x.date+'');

                x.date = buf.slice(0, buf.lastIndexOf('T'))
                    + ' '
                    + buf.slice(buf.lastIndexOf('T')+1, buf.lastIndexOf('.'));
            });
            this.response.send(users);
        } catch (e) {
            console.log('Error in get users.');
            console.error(e);
            this.response.send(e);
        }
    }

    async postUsers() {
        console.log(this.request.body);
        try {
            await this.mongoDBService.connect();

            await this.mongoDBService.insert('users', {
                id: this.request.body.id,
                score: parseInt(this.request.body.rightPlace),
                date: new Date()
            });

            this.mongoDBService.disconnect();
            this.response.send({ message: 'Success' });
        } catch (e) {
            console.log('Error in post users.');
            this.response.send(e);
        }
    }
}

module.exports = DBController;
