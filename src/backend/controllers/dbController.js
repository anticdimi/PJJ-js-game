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
            const dbController = new DBController(req, res);
            if (await dbController.getUser() !== undefined)
                await dbController.postUsers();
            else
                await dbController.putUser();
        });

        app.get('/api/scores', async (req, res) => {
            try {
                new DBController(req, res).getUsers();
            } catch (e) {
                console.log('Error while reading scores.');
                console.error(e);
            }

        });
    }

    async getUsers() {
        try {
            await this.mongoDBService.connect();

            let users = await this.mongoDBService.find('users');

            this.mongoDBService.disconnect();
            this.response.send(users);
        } catch (e) {
            console.log('Error in get users.');
            console.log(e);
            this.response.send(e);
        }
    }

    async getUser() {
        try {
            await this.mongoDBService.connect();

            const user = await this.mongoDBService.findOne('users', { id: this.request.body.id });

            this.mongoDBService.disconnect();
            return user
        } catch (e) {
            console.log('Error in get user.');
            this.response.send(e);
            return undefined;
        }

    }

    async postUsers() {
        console.log(this.request.body);
        try {
            await this.mongoDBService.connect();

            await this.mongoDBService.insert('users', {
                id: this.request.body.id,
                score: this.request.body.rightPlace
            });

            this.mongoDBService.disconnect();
            this.response.send({ message: 'Success' });
        } catch (e) {
            console.log('Error in post users.');
            this.response.send(e);
        }
    }

    async putUser() {
        console.log(this.request.body);
        try {
            await this.mongoDBService.connect();

            await this.mongoDBService.update('users', { id: this.request.body.id }, {
                score: this.request.body.rightPlace
            });

            this.mongoDBService.disconnect();
            this.response.send({ message: 'Success' });
        } catch (e) {
            console.log('Error in put user.');
            this.response.send(e);
        }
    }
}

module.exports = DBController;