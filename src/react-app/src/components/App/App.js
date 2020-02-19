import React, { Component } from 'react';
import './App.css';
import Leaderboard from "../Leaderboard/Leaderboard";

class App extends Component {
  constructor(props) {
    super(props);

    this.goTo = this.goTo.bind(this);
  }

  async componentDidMount() {
      // let res = await axios.get('http://localhost:8080/api/scores');
      // res.data = res.data.sort((a, b) => a.score < b.score);
      // this.setState({ data: res.data });
  }
    goTo() {
        window.location.href='http://localhost:63342/PJJ-js-game/src/game-page/index.html';
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
