// =========================================================
// Config

const SERVER_ENDPOINT = 'http://localhost:8080';

const symbolMap = {
    0: "<img src='../../imgs/red.png' style='width: 80%;height: 80%'>",
    1: '<img src="../../imgs/orange.png" style="width: 80%;height: 80%">',
    2: '<img src="../../imgs/turqouise.png" style="width: 80%;height: 80%">',
    3: '<img src="../../imgs/violet.png" style="width: 80%;height: 80%">',
};

const scoreSymbolMap = {
    0: '<img src="../../imgs/green.png" style="width: 80%;height: 80%">',
    1: "<img src='../../imgs/red.png' style='width: 80%;height: 80%'>",
};


// =========================================================
// Global params

const game = new Game();

let currentRowIndex = 0;
let currentCellIndex = 0;
let combination = new Array(4);

const choiceRows = document.getElementById('player_choice')
    .getElementsByTagName('tr');
const scoreRows = document.getElementById('score')
    .getElementsByTagName('tr');
// =========================================================

function Game() {
    this.GAME_TIME = 90;
    this.MAX_ATTEMPTS = 5;
    this.generateSecret = () => {
        let generatedSecret = [];
        for (let i = 0; i < 4; i++) {
            generatedSecret.push(parseInt(Math.random() * 100 + "") % 4);
        }
        console.log(generatedSecret);

        return generatedSecret;
    };

    this.attempts = 0;
    this.timerStarted = false;
    this.timerListener = 0;
    this.elapsedTime = 0;

    this.initGame = () => {
        this.SECRET = this.generateSecret();

        for (let i = 0; i < 4; i++) {
            document.getElementById('choice')
                .getElementsByTagName('td')[i].innerHTML = symbolMap[i];
        }

        document.getElementById('wrapper')
            .style.visibility = 'visible';

        document.getElementById('timer')
            .style.visibility = 'visible';
    };

    this.startGame = () => {
        if (document.getElementById('usr').value === "") {
            window.alert('Unesite username!');
            return;
        }

        if (!this.timerStarted) {
            this.timerStarted = true;
            this.timerListener = window.setInterval(() => {
                this.elapsedTime++;

                const progress = ((this.elapsedTime / this.GAME_TIME) * 100);
                document.getElementsByClassName('progress-bar')[0]
                    .style.width = progress+'%';

                document.getElementById('timer')
                    .setAttribute('aria-valuenow', progress+'');

                if (this.elapsedTime === this.GAME_TIME) {
                    clearInterval(game.timerListener);
                    this.endGame();
                }
            }, 1000);

            this.initGame();
        }
    };
    this.endGame = async () => {
        await notifyServer(this.currentState, this.attempts);
        this.attempts = this.MAX_ATTEMPTS + 1;
        clearInterval(this.timerListener);

        const cells = document.getElementById('correct_answer').getElementsByTagName('td');

        for (let i = 0; i < 4; i++) {
            cells[i].innerHTML = symbolMap[this.SECRET[i]];
        }
    };

    this.resetGame = () => {
        location.reload();
    };
}

const evaluateScore = (combination) => {
    let hints = { rightPlace: 0, wrongPlace: 0 };

    let solution = game.SECRET.slice();

    // check for correct positions
    for (let i = 0; i < 4; i++) {
        if (combination[i] === solution[i]) {
            hints.rightPlace++;
            solution[i] = combination[i] = null;
        }
    }
    // check for incorrect positions
    for (let i = 0; i < 4; i++) {
        for (let x = 0; x < 4; x++) {
            if(combination[i] && solution[x]) {
                if (combination[i] === solution[x]) {
                    hints.wrongPlace++;
                    solution[x] = combination[i] = null;
                }
            }
        }
    }

    ++game.attempts;

    return hints;
};


const notifyServer = async (state, attempts) => {
    try {
        const user = document.getElementById('usr').value === '' ?
            'random_placeholder' : document.getElementById('usr').value;

        const res = await axios.post(SERVER_ENDPOINT+'/api/save', { rightPlace: (state.rightPlace * 10.0 * (1/attempts)), id: user });
        console.log(res.data);
    } catch (e) {
        console.log('Error while notifing server: ');
        console.log(e);
    }
};

const renderState = () => {
    for (let i = 0; i < game.currentState.rightPlace; i++) {
        scoreRows[currentRowIndex].getElementsByTagName('td')[i]
            .innerHTML = scoreSymbolMap[0];

    }
    for (let i = game.currentState.rightPlace; i < game.currentState.rightPlace + game.currentState.wrongPlace; i++) {
        scoreRows[currentRowIndex].getElementsByTagName('td')[i]
            .innerHTML = scoreSymbolMap[1];

    }
    if (game.currentState.rightPlace === 4) {
        window.alert('Wooohooo you\'ve won the game!');

        game.endGame(game.currentState);
    }

};

const deleteChoice = (id) => {
    const i = parseInt(id[0]);
    const j = parseInt(id[1]);
    const clickedCell = choiceRows[i].getElementsByTagName('td')[j];
    if (i === currentRowIndex) {
        if (clickedCell.className === 'armed') {
            clickedCell.classList.toggle('armed');
            clickedCell.innerHTML = '';
            if (j <= currentCellIndex)
                currentCellIndex = j;
        }
    }
};

const updateCursor = (currentCellIndex) => {
    if (currentCellIndex === 3) {
        game.currentState = evaluateScore(combination);
        renderState();
        combination = [];

        currentRowIndex++;

        if (currentRowIndex > 5) {
            game.endGame();
        }

        return 0;
    }

    for (let i = currentCellIndex; i < 4; i++) {
        if (choiceRows[currentRowIndex].getElementsByTagName('td')[i].className !== 'armed')
            return i;
    }
};

const goToLeaderboard = () => {
    window.location.href='http://localhost:3001/';
};

const choiceOnClick = (id) => {
    if (game.attempts > game.MAX_ATTEMPTS) {
        return;
    }

    const currPlayerCell = choiceRows[currentRowIndex].getElementsByTagName('td')[currentCellIndex];

    if (currPlayerCell.className !== 'armed') {
        currPlayerCell.innerHTML = symbolMap[id];
        combination[currentCellIndex] = parseInt(id);

        currPlayerCell.classList.toggle('armed');

        currentCellIndex = updateCursor(currentCellIndex);
    }
};
