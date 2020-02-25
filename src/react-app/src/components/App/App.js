import React, { Component } from 'react';
import './App.css';
import Leaderboard from "../Leaderboard/Leaderboard";

class App extends Component {
  constructor(props) {
    super(props);

    this.goTo = this.goTo.bind(this);
  }
    goTo() {
        window.location.href='http://localhost/PJJ-js-game/src/game-page/';
    }
    render() {

    return (
        <div>
          <Leaderboard />
          <button onClick={this.goTo}>Play game</button>
        </div>
    )
  }
}

export default App;
