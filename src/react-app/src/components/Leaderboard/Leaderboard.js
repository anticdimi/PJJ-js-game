import React, { Component } from 'react';
import './Leaderboard.css';
import axios from "axios";

class Leaderboard extends Component {
  constructor(props){
    super(props);
    this.state = { data: [] };
  }

  async componentDidMount() {
    const res = await axios.get('http://localhost:8080/api/scores');
    this.setState({ data: res.data });
  }

  render() {
    return (
      <div>
        <h2>Mastermind leader board</h2>
        <table>
          <tbody>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
          {this.state.data.map((el, i) => {
            return (
                <tr key={i}>
                  <td>{i+1}</td>
                  <td>{el['id']}</td>
                  <td>{el['score']}</td>
                  <td>{el['date']}</td>
                </tr>
            )
          })}
          </tbody>

        </table>
      </div>
    );
  }
}

export default Leaderboard;
