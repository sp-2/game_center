import React, { Component } from 'react';
import "react-router";
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'
import axios from 'axios';

class GameStats extends Component {
	constructor(props) {
      super(props);
      this.state = {
        statsList:[]
      };
  }

   componentDidMount(){
       axios.get('http://localhost:8000/stats')
        .then(response => {
           console.log('p',response.data );
           this.setState({ statsList: response.data.data });
        })
        .catch(function (error) {
          console.log(error);
        })
     }
  render(){
    const listItems = this.state.statsList.map((stat, index) => {
      return  <tr key={index}><td>{stat.gameId}</td><td>{stat.level}</td><td>{stat.timeRBS}</td><td>{stat.timeNRBS}</td></tr>
      });
		return (
      <div>
      <div class="panel panel-default">
        <div class="panel-body" style={{ background: 'linear-gradient(to right, #c7dec7 0%, #8FBC8F 100%)',marginTop: '0px', marginBottom:'20px', paddingLeft: '20px', paddingRight: '20px', paddingTop: '25px', paddingBottom: '40px', textAlign: 'center'}}>
        <h1>Game Stats</h1><br></br>
        <table class="table table-bordered table-light table-striped"  style={{  marginRight: 'auto', marginLeft: 'auto'}}>
						<thead>
							<tr>
								<th >Game ID</th>
                <th>Level</th>
                <th>RBS(ms)</th>
                <th>IBS(ms)</th>
							</tr>
						</thead>
						<tbody>
              {listItems}
            </tbody>
        </table>
        <br></br>
        <p><em>Solver times in ms.</em> </p>
        <p><strong>RBS:</strong> <em>Recursive Backtracking Solver.</em> </p>
        <p><strong>IBS:</strong> <em>Iterative Backtracking Solver.</em> </p>
      </div></div></div>
		)
	}
}
export default GameStats;
