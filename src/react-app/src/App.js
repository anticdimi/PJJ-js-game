import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.goTo = this.goTo.bind(this);
    this.state = { data: [] };
  }

  async componentDidMount() {
      let res = await axios.get('http://localhost:8080/api/scores');
      res.data = res.data.sort((a, b) => a.score < b.score);
      this.setState({ data: res.data });
  }
    goTo() {
        window.location.href='http://localhost:63342/PJJ-js-game/src/game-page/index.html';
    }
    render() {

    return (
        <div>
              <table>
                  <tbody>
                  <tr>
                      <th>Username</th>
                      <th>Score</th>
                      <th>Date</th>
                  </tr>
                  {this.state.data.map((el, i) => {
                      return (
                          <tr key={i}>
                              <td>{el['id']}</td>
                              <td>{el['score']}</td>
                              <td>{el['date']}</td>
                          </tr>
                      )
                  })}
                  </tbody>

              </table>
              <button onClick={this.goTo}>Play game</button>
        </div>
    )
  }
}

export default App;
