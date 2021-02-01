import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Square(props) {
  return (
    <button type="button" class="btn btn-secondary" disabled={props.isDisabled}
      style={{backgroundColor:props.value, height:"70px", width:"70px", marginTop: '-5px'}}
      className="square"
      onClick={props.onClick}
    >
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      cellValues: ["blue", "DarkKhaki", "yellow", "white", "Orange", "pink",
                   "LawnGreen", "BlanchedAlmond", "green", "yellow", "red", "white",
                   "red", "Fuchsia", "DarkOrchid", "brown", "Peru", "DarkOrchid",
                   "gold", "DodgerBlue", "Tomato", "DarkKhaki", "LightSteelBlue", "IndianRed",
                   "IndianRed", "blue", "purple", "pink", "Peru", "SlateBlue",
                   "Orange", "SlateBlue", "LightSteelBlue",  "green", "Turquoise", "Tan",
                   "purple", "violet", "violet", "brown", "DodgerBlue", "gold",
                   "Turquoise", "LawnGreen", "BlanchedAlmond", "Fuchsia", "Tan", "Tomato"
                 ],
      squares: Array(48).fill("silver"),
      saved_squares: Array(48).fill("silver"),
      isDisabled: Array(48).fill(false),
      guessOne: true,
      guessTwo: false,
      index1: false,
      playButtonText: "Play",
      buttonText: "See Solution",
      gameOver: false,
      gameOverText: "Game Over!!!",
      cnt: 0
      };
  }

  onClickHandler(i) {
    const squares = this.state.squares.slice();
    const isDisabled = this.state.isDisabled.slice();

    if(this.state.guessOne){
      squares[i] = this.state.cellValues[i];

      this.setState({
        squares: squares,
        guessOne: false,
        guessTwo: true,
        index1: i,
      });
    } else if(this.state.guessTwo){
        squares[i] = this.state.cellValues[i];

        this.setState({
          squares: squares,
          guessOne: true,
          guessTwo: false
        },() => {
          if (!this.isMatch(this.state.index1,i)){
            this.flipCells(this.state.index1,i);
          } else {
            var cnt = this.state.cnt;
            cnt = cnt + 1;
            isDisabled[i] = true;
            isDisabled[this.state.index1] = true;
            cnt == 24 ? this.setState({gameOver: true, cnt:0, isDisabled: isDisabled}) : this.setState({cnt: cnt, isDisabled: isDisabled});
          }
      });
    }
  }

flipCells = (index1, index2) => {
  const squares = this.state.squares.slice();
      squares[index1] = "silver";
      squares[index2] = "silver";
  let intervalId = setTimeout(() => {
    this.setState({
      squares: squares,
    });
  }, 1000);
};

isMatch(index1, index2){
  return this.state.squares[index1] == this.state.squares[index2];
}

onSeeSolutionsHandler(){
  var buttonText = this.state.buttonText;
  var saved_squares;
  var squares;

  if(buttonText == "See Solution"){
    buttonText  = "Back To Puzzle";
    saved_squares = this.state.squares.slice();
    squares       = this.state.cellValues.slice();
  } else {
    buttonText  = "See Solution";
    squares       = this.state.saved_squares.slice();
  }

  this.setState({squares: squares, saved_squares: saved_squares, buttonText: buttonText}, function () {
  });
}

displayCell(i) {
  return (
    <Square
      value={this.state.squares[i]}
      val=''
      isDisabled={this.state.isDisabled[i]}
      onClick={() => this.onClickHandler(i)}
    />
  );
}

displayPlayAgainCell() {
  return (
    <button
    style={{backgroundColor:"DodgerBlue", color:"white", height:"40px", width:"140px"}}
      className="square"
      onClick={ () => {const squares = Array(48).fill("silver");
        const isDisabled = Array(48).fill(false);
        var playButtonText = "Play Again";
        const cellValues = this.state.cellValues.slice();
        this.shuffleArray(cellValues);
        this.setState({squares: squares, cellValues: cellValues, playButtonText: playButtonText, cnt:0, gameOver:false, isDisabled: isDisabled})}}
    >
      {this.state.playButtonText}
    </button>
  );
}

displaySeeSolutionsCell() {
  return (
    <button
      style={{backgroundColor:"DodgerBlue", color:"white", height:"40px", width:"140px"}}
      className="square"
      onClick={() => this.onSeeSolutionsHandler()}
    >
      {this.state.buttonText}
    </button>
  );
}

shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}
render() {
  return (
    <div >
      <div class="panel panel-default">
  			<div class="panel-body" style={{ background: 'linear-gradient(to right, #ffcc99 0%, #ff9900 100%)',marginTop: '0px', marginBottom:'20px', paddingLeft: '20px', paddingTop: '25px', paddingBottom: '40px', textAlign: 'center'}}>
          <h4 style={ this.state.gameOver? {display: 'inline', color:"red"} : {display: 'none'}}> {this.state.gameOverText} </h4>
          <br></br><br></br>
          <div className="board-row" style={{marginTop: '0px', paddingTop: '0px', marginBottom:'0px', paddingBottom: '0px'}}>
            {this.displayCell(0)}
            {this.displayCell(1)}
            {this.displayCell(2)}
            {this.displayCell(3)}
            {this.displayCell(4)}
            {this.displayCell(5)}
            {this.displayCell(6)}
            {this.displayCell(7)}
          </div>
          <div className="board-row">
            {this.displayCell(8)}
            {this.displayCell(9)}
            {this.displayCell(10)}
            {this.displayCell(11)}
            {this.displayCell(12)}
            {this.displayCell(13)}
            {this.displayCell(14)}
            {this.displayCell(15)}
          </div>
          <div className="board-row">
            {this.displayCell(16)}
            {this.displayCell(17)}
            {this.displayCell(18)}
            {this.displayCell(19)}
            {this.displayCell(20)}
            {this.displayCell(21)}
            {this.displayCell(22)}
            {this.displayCell(23)}
          </div>
          <div className="board-row">
            {this.displayCell(24)}
            {this.displayCell(25)}
            {this.displayCell(26)}
            {this.displayCell(27)}
            {this.displayCell(28)}
            {this.displayCell(29)}
            {this.displayCell(30)}
            {this.displayCell(31)}
          </div>
          <div className="board-row">
            {this.displayCell(32)}
            {this.displayCell(33)}
            {this.displayCell(34)}
            {this.displayCell(35)}
            {this.displayCell(36)}
            {this.displayCell(37)}
            {this.displayCell(38)}
            {this.displayCell(39)}
          </div>
          <div className="board-row">
            {this.displayCell(40)}
            {this.displayCell(41)}
            {this.displayCell(42)}
            {this.displayCell(43)}
            {this.displayCell(44)}
            {this.displayCell(45)}
            {this.displayCell(46)}
            {this.displayCell(47)}
          </div>
          <br></br>
          <div className="board-row">
            {this.displayPlayAgainCell()}
          </div>
          <br></br>
          <div className="board-row">
            {this.displaySeeSolutionsCell()}
          </div>
        </div>
      </div>
    </div>
  );
}
}

class MemoryGame extends React.Component {
render() {
  return (
      <div class="container">
        <h1 style={{textAlign: 'center'}}> Memory Game </h1>
        <br/>
        <Board />
      </div>
  );
}
}

export default MemoryGame;
