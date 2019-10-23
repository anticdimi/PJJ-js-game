// =========================================================
// Config

const symbolMap = {
    0: 'sym_1',
    1: 'sym_2',
    2: 'sym_3',
    3: 'sym_4',
};

const scoreSymbolMap = {
    0: '+',
    1: '*',
};

const GAME_TIME = 60;

// =========================================================
// Global params

let currentRowIndex = 0;
let currentCellIndex = 0;
let combination = [];
let currentState = {};

let solution;

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
    return generatedSolution;

};

const startGame = () => {
    if (!timerStarted) {
        timer = window.setInterval(() => {
            elapsedTime++;

            document.getElementById('timer')
                .innerText = 'Time elapsed: ' + elapsedTime;

            if (elapsedTime === GAME_TIME) {
                clearInterval(timer);
                endGame(currentState);
            }
        }, 1000);
    }

    for (let i = 0; i < 4; i++) {
        document.getElementById('choice')
            .getElementsByTagName('td')[i].innerHTML = symbolMap[i];
    }

    solution = generateSolution();

    document.getElementById('wrapper')
        .style.visibility = 'visible';

    document.getElementById('timer')
        .style.visibility = 'visible';
};

const endGame = (state) => {
    window.alert('Game over...');
    notifyServer(state);
    clearInterval(timer);

    const cells = document.getElementById('right_answer').getElementsByTagName('td');

    for (let i = 0; i < 4; i++) {
        cells[i].innerHTML = symbolMap[solution[i]];
    }
};

const resetGame = () => {
    location.reload();
};

const evaluateScore = (combination, solution) => {
    let rightPlace = 0;

    let wrongPlace = 0;

    const matched = [];
    for (let i = 0; i < 4; i++) {
        if (combination[i] === solution[i]) {
            rightPlace++;
            matched.push(i);
        }

    }
    for (let i = 0; i < 4; i++) {
        if (matched.includes(i)) {
            continue;

        }
        for (let j = 0; j < 4; j++) {
            if (matched.includes(j)) {
                continue;

            }
            if (i !== j) {
                if (combination[i] === solution[j]) {
                    wrongPlace++;
                    break;
                }
            }
        }

    }
    return { rightPlace, wrongPlace };
};

const notifyServer = (state) => {
    // TODO implement REST server
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
    console.log(state['rightPlace']);
    console.log(state.wrongPlace);
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

const choiceOnClick = (id) => {
    const currPlayerCell = choiceRows[currentRowIndex].getElementsByTagName('td')[currentCellIndex];

    currPlayerCell.innerHTML = symbolMap[id];

    combination.push(parseInt(id));

    currentCellIndex++;

    if (currentCellIndex === 4) {
        console.log('Current combination: ' + combination);
        currentState = evaluateScore(combination, solution);
        renderState(currentState);
        combination = [];

        currentCellIndex = 0;

        currentRowIndex++;

        if (currentRowIndex > 5) {
            endGame(currentState);
        }
    }
};


