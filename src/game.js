// =========================================================
// Config

const symbolMap = {
    0: "<img src='../imgs/red.png' style='width: 80%;height: 80%'>",
    1: '<img src="../imgs/orange.png" style="width: 80%;height: 80%">',
    2: '<img src="../imgs/turqouise.png" style="width: 80%;height: 80%">',
    3: '<img src="../imgs/violet.png" style="width: 80%;height: 80%">',
};

const scoreSymbolMap = {
    0: '<img src="../imgs/green.png" style="width: 80%;height: 80%">',
    1: "<img src='../imgs/red.png' style='width: 80%;height: 80%'>",
};

const GAME_TIME = 90;
const MAX_ATTEMPTS = 5;

let SECRET;

// =========================================================
// Global params

let currentRowIndex = 0;
let currentCellIndex = 0;
let combination = new Array(4);
let currentState = {};

let attempts = 0;

let generatedSecret;

let timerStarted = false;
let timer;
let elapsedTime = 0;

const choiceRows = document.getElementById('player_choice')
    .getElementsByTagName('tr');
const scoreRows = document.getElementById('score')
    .getElementsByTagName('tr');
// =========================================================

// TODO check for better random
const generateSolution = () => {
    let generatedSolution = [];
    for (let i = 0; i < 4; i++) {
        generatedSolution.push(parseInt(Math.random() * 100 + "") % 4);
    }
    console.log(generatedSolution);

    SECRET = generatedSolution;

    return generatedSolution;
};

const startGame = () => {
    if (!timerStarted) {
        timerStarted = true;
        timer = window.setInterval(() => {
            elapsedTime++;

            const progress = ((elapsedTime / GAME_TIME) * 100);
            document.getElementsByClassName('progress-bar')[0]
                .style.width = progress+'%';

            document.getElementById('timer')
                .setAttribute('aria-valuenow', progress+'');

            if (elapsedTime === GAME_TIME) {
                clearInterval(timer);
                endGame(currentState);
            }
        }, 1000);

        initGame();
    }
};

const endGame = (state) => {
    attempts = MAX_ATTEMPTS + 1;
    notifyServer(state);
    clearInterval(timer);

    const cells = document.getElementById('correct_answer').getElementsByTagName('td');

    for (let i = 0; i < 4; i++) {
        cells[i].innerHTML = symbolMap[generatedSecret[i]];
    }
};

const resetGame = () => {
    location.reload();
};

const evaluateScore = (combination) => {
    let hints = { rightPlace: 0, wrongPlace: 0 };

    let solution = SECRET.slice();

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

    ++attempts;

    return hints;
};

const notifyServer = (state) => {
    // TODO which server?
    /*
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'some_server_url', false);
    xhttp.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ user: 'some_username', score: state}));
    */

    console.log('===================================');
    console.log('Should notify server');
    console.log('Your score: ');
    console.log(state);
    console.log('===================================');

};

const renderState = (state) => {
    for (let i = 0; i < state.rightPlace; i++) {
        scoreRows[currentRowIndex].getElementsByTagName('td')[i]
            .innerHTML = scoreSymbolMap[0];

    }
    for (let i = state.rightPlace; i < state.rightPlace + state.wrongPlace; i++) {
        scoreRows[currentRowIndex].getElementsByTagName('td')[i]
            .innerHTML = scoreSymbolMap[1];

    }
    if (state.rightPlace === 4) {
        window.alert('Wooohooo you\'ve won the game!');

        endGame(state);
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
        currentState = evaluateScore(combination);
        renderState(currentState);
        combination = [];

        currentRowIndex++;

        if (currentRowIndex > 5) {
            endGame(currentState);
        }

        return 0;
    }

    for (let i = currentCellIndex; i < 4; i++) {
        if (choiceRows[currentRowIndex].getElementsByTagName('td')[i].className !== 'armed')
            return i;
    }
};

const choiceOnClick = (id) => {
    if (attempts > MAX_ATTEMPTS) {
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

const initGame = () => {
    generatedSecret = generateSolution();

    for (let i = 0; i < 4; i++) {
        document.getElementById('choice')
            .getElementsByTagName('td')[i].innerHTML = symbolMap[i];
    }

    document.getElementById('wrapper')
        .style.visibility = 'visible';

    document.getElementById('timer')
        .style.visibility = 'visible';
};
