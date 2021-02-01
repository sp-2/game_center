import React, { Component } from 'react';


class Home extends Component {
	constructor(props) {
  		super(props);
  }

  render(){
		return (
      <div class="container">
			<div class="panel panel-default">
				  <div class="panel-body" style={{ background: 'linear-gradient(to right, #ffcc99 0%, #ff9900 100%)',marginTop: '0px', marginBottom:'20px', paddingLeft: '20px', paddingTop: '25px', paddingBottom: '40px', textAlign: 'center'}}>
        <h1>Welcome to Game Center!</h1>
				<br></br>
				<p><strong>Game Center</strong> currently features the following games:</p>
				<h5>Memory Game:</h5>
				<p>This is a version of the classic memory game implemented in React.</p>
				<h5>Sudoku:</h5>
				<p>This is a Sudoku Puzzle Generator which generates Random Unique Sudoku Puzzles in real time.</p>
				<h5>Sudoku Puzzle Solver:</h5>
				<p>These are Sudoku Puzzle Solvers implemented using Recursive and Iterative Backtracking Algorithms.</p>
				<h5>Features:</h5>
				<p>All puzzles are implemented with React as frontend and Node, Express and MongoDB at the backend.</p>
				<h5>Future Enhancements:</h5>
				<p>** Use redux for State Management.</p>
				<p>** Implement Sudoku Solver using a Strategy Based Logical Solving Algorithm.</p>
      </div>
			</div></div>
		)
	}
}

export default Home;
