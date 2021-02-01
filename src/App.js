
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import "react-router";
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'
import Home from "./Home.js";
import MemoryGame from "./MemoryGame.js"
import SudokuPuzzleGenerator from "./SudokuPuzzleGenerator.js"
import SudokuPuzzleSolver from "./SudokuPuzzleSolver.js"
import GameStats from "./GameStats.js";


class App extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <BrowserRouter>
      <div class="container" style={{textAlign: 'center'}}>
          <div>
              <br/>
              <a href="/home" ><button class="btn btn-primary" style={{width:"140px", borderRadius: '0'}}>Game Center</button></a>
              <a href="/memoryGame" ><button class="btn btn-warning" style={{width:"140px", borderRadius: '0'}}>Memory Game</button></a>
              <a href="/generateSudoku" ><button  class="btn btn-info" style={{width:"140px", borderRadius: '0'}}>Sudoku</button></a>
              <a href="/solveSudoku" ><button class="btn btn-danger" style={{width:"140px", borderRadius: '0'}}>Solve Sudoku</button></a>
              <a href="/GameStats" ><button class="btn btn-success" style={{width:"140px", borderRadius: '0'}}>Game Statistics</button></a>
              <br/><br/>
          </div>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route
              path='/memoryGame'
              render={(props) => <MemoryGame  />}
            />
            <Route
              path='/generateSudoku'
              render={(props) => <SudokuPuzzleGenerator />}
            />
            <Route
              path='/solveSudoku'
              render={(props) => <SudokuPuzzleSolver/>}
            />
            <Route
              path='/GameStats'
              render={(props) => <GameStats/>}
            />
          </div>
      </BrowserRouter>
   )
 }

}

export default App;
