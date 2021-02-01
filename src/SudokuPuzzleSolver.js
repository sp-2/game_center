import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function SquareB(props) {
    return (
      <button
        style={props.style}
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }

  function SquareF(props) {
      return (
          <input size="2" maxLength="1" readOnly={props.readOnlyVal}
            type="text"
            placeholder=""
            style={props.styleSettings}
            key={props.keyValue}
            defaultValue={props.defaultValue}
            onChange={props.onChange}
            onClick={props.onClick}
          />
    );
  }

class Board extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      puzzle: Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false})),
      board: Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false})),
      gameId:'', level:'', timeRBS:'', timeNRBS:'',
      timeRBSFlag:false, timeNRBSFlag:false
      };
  }

  onSolveHandlerRBS() {
    var puzzle = this.deepCopy(this.state.board);
    var board = this.deepCopy(puzzle);
    var timeRBSFlag = true;
    var a = performance.now();
    this.solveSudokuRBS(0,0,board);
    var b = performance.now();
    var timeRBS = (b-a).toFixed(2);
    console.log('It took ' + (b - a) + ' ms.');
    this.setState({puzzle: puzzle, board: board, timeRBSFlag: timeRBSFlag, timeRBS: timeRBS}, function () {
      // console.log('in onPlayAgainHandler b',this.state.board);
      // console.log('in onPlayAgainHandler p',this.state.puzzle);
    });
  }

  onSolveHandlerNRBS() {
    var timeNRBSFlag = true;
    var puzzle = this.deepCopy(this.state.board);
    var a = performance.now();
    var board = this.getSolutionNRBS(puzzle);
    var b = performance.now();
    var timeNRBS = (b-a).toFixed(2);
    console.log('It took ' + (b - a) + ' ms.');
    this.setState({board: board, puzzle: puzzle, timeNRBSFlag: timeNRBSFlag, timeNRBS: timeNRBS}, function () {
      // console.log('in onPlayAgainHandler b',this.state.board);
      // console.log('in onPlayAgainHandler p',this.state.puzzle);
    });
  }

  getSolutionNRBS(puzzle){
    var nrows = 9;
    var ncols = 9;
    var squares =new Array(nrows);

    for (var i=0;i<nrows;i++) {
      squares[i]=new Array(ncols)
    }

    for (var i=0;i<nrows;i++) {
       for (var j=0;j<nrows;j++) {
         squares[i][j] = {value:puzzle[i][j].value,pencilMark:[]};
       }
    }

    var numbers = [];

    for(let r=0; r<nrows; r++){
      for(let c=0; c<ncols; c++){
          if(puzzle[r][c].given == true){
            continue;
          }

          numbers = this.validPencilMarks(r,c,squares);

          if(numbers.length!=0){
              var val = numbers.pop();
              squares[r][c].value = val;
              for(let rn=0; rn<numbers.length; rn++){
                squares[r][c].pencilMark.push(numbers[rn]);
              }

          } else {
              while(r>=0){
                c--;
                if(c<0){r--;c=ncols-1}
                if(r<0){break;}

                if(puzzle[r][c].given == true){
                  continue;
                }

                if(squares[r][c].pencilMark.length!=0){
                  squares[r][c].value = squares[r][c].pencilMark.pop();
                  break;
                } else {
                  squares[r][c].value = undefined;
                }
              }
          }
      }
    }
    //console.log('st',squares);
    return squares;
  }

  solveSudokuRBS(row, col, board){
    if(row>=9){return true;}

    while(board[row][col].given == true){
      col = col+1;
      row = (col<=8)?row:row+1;
      col = (col<=8)?col:0;
      if(row==9){return true;}
    }

    var pencilMarks = this.validPencilMarks(row,col,board);

    var c = col+1;
    var r = (c<=8)?row:row+1;
    c = (c<=8)?c  :0;

    for(let i=0; i<pencilMarks.length; i++){
      board[row][col].value = pencilMarks[i];
      board[row][col].given = true;
      if(this.solveSudokuRBS(r,c,board)){return true;}
    }
    board[row][col].value = undefined;
    board[row][col].given = false;
    return false;
  }

  validPencilMarks(row,col,board){
    var pM = [1,2,3,4,5,6,7,8,9];
    pM = this.checkCell(row,col,pM,board);
    pM = this.checkRow(row,col,pM,board);
    pM = this.checkCol(row,col,pM,board);
    return pM;
  }

  deepCopy(obj) {
      var rv;

      switch (typeof obj) {
          case "object":
              if (obj === null) {
                  rv = null;
              } else {
                  switch (toString.call(obj)) {
                      case "[object Array]":
                          rv = obj.map(o => this.deepCopy(o));
                          break;
                      default:
                          rv = Object.keys(obj).reduce((prev, key) => {
                              prev[key] = this.deepCopy(obj[key]);
                              return prev;
                          }, {});
                          break;
                  }
              }
              break;
          default:
              rv = obj;
              break;
      }
      return rv;
  }

  getStartIndex(index){
    //return Math.floor(index/3) * 3;
    switch(index) {
        case 0:
        case 1:
        case 2:
            return 0;
        case 3:
        case 4:
        case 5:
            return 3;
        case 6:
        case 7:
        case 8:
            return 6;
        default:
            return 0;
    }
  }

  checkCell = (r,c,numbers,squares) => {

    var rowStart = this.getStartIndex(r);
    var colStart = this.getStartIndex(c);

    for(let row=rowStart; row<=rowStart+2; row++){
      for(let col=colStart; col<=colStart+2; col++){
        if(!(row == r && col == c)){
          if(squares[row][col].value != undefined){
            if(numbers.indexOf(squares[row][col].value)!=-1){
             numbers.splice(numbers.indexOf(squares[row][col].value),1);
            }
          }
        }
      }
    }
    return numbers;
  }

  checkRow = (r,c,numbers,squares) => {
    for(let i=0; i<9; i++){
      if(i != c){
        if(squares[r][i].value != undefined){
          if(numbers.indexOf(squares[r][i].value)!=-1){
           numbers.splice(numbers.indexOf(squares[r][i].value),1);
          }
        }
      }
    }
      return numbers;
  }

  checkCol = (r,c,numbers,squares) => {
    for(let i=0; i<9; i++){
      if(i != r){
        if(squares[i][c].value != undefined){
          if(numbers.indexOf(squares[i][c].value)!=-1){
           numbers.splice(numbers.indexOf(squares[i][c].value),1);
          }
        }
      }
    }
    return numbers;
  }

  valChangeHandler = (i,j,event) => {
    const board  = this.deepCopy(this.state.board);

    if(event.target.value){
        board[i][j].value = Number(event.target.value);
        board[i][j].given = true;

        this.setState({board: board}, function () {
          // console.log('in val ',this.state.board);
          // console.log('in val ',this.state.puzzle);
        });
    } else {
      board[i][j].value = undefined;
      board[i][j].given = false;
      this.setState({board: board}, function () {
        // console.log('in val ',this.state.board);
        // console.log('in val ',this.state.puzzle);
      });
    }
  }

  onResetHandler(){
    var  board = this.deepCopy(this.state.puzzle);
    this.setState({board: board}, function () {
      //console.log('in onResetHandler',this.state.board);
    });
  }

  onSaveStatsHandler(){
    var level = this.state.level;
    var level_number;

    switch(level) {
    case "easy":
      level_number = 1;
      break;
    case "medium":
      level_number = 2;
      break;
    case "hard":
      level_number = 3;
      break;
    case "evil":
      level_number = 4;
      break;
    case "diabolical":
      level_number = 5;
      break;
    default:
      level_number = 6;
}

    const stat = {
      gameId: this.state.gameId,
      level : this.state.level,
      level_number: level_number,
      timeRBS : this.state.timeRBS,
      timeNRBS: this.state.timeNRBS
    };
    axios.post('http://localhost:8000/stats', stat)
        .then(res => console.log(res.data));
  }

  displayCellForm(i,j,bg="white") {
    return (
      <SquareF
        readOnlyVal={this.state.puzzle[i][j]?this.state.puzzle[i][j].given:false}
        styleSettings={ {fontWeight: this.state.puzzle[i][j].given ? 'bold' : 'normal', height:"50px", width:"50px", backgroundColor:bg, textAlign: 'center'}}
        keyValue={this.state.board[i][j]?this.state.board[i][j].value+'['+i+']'+'['+j+']':undefined}
        defaultValue={this.state.board[i][j]?this.state.board[i][j].value:""}
        onChange={(event) => this.valChangeHandler(i,j,event)}
      />
    );
  }
  displayCellInput(val) {
    return (
        <input size="8"
          type="text"
          placeholder=""
          value={val}
        />
    );
  }

  displayCellInputId(val) {
    return (
        <input size="8"
          type="text"
          placeholder=""
          value={val}
          keyValue={this.state.gameId}
          defaultValue={this.state.gameId}
          onChange={(event)=>this.setState({gameId: event.target.value})}
        />
    );
  }

  displayCellInputSelect(val) {
    return (
      <label>
          <select value={val} onChange={(event)=>this.setState({level: event.target.value})}>
            <option value="unknown">unknown</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
            <option value="evil">evil</option>
            <option value="diabolical">diabolical</option>
          </select>
      </label>
    );
  }

  displayResetCell() {
    return (
      <SquareB
        style={{backgroundColor:"SlateBlue", color:"white", height:"40px", width:"100px"}}
        className="square"
        onClick={() => this.onResetHandler()}
        value="Reset"
      />
    );
  }

  displaySaveStatsCell() {
    return (
      <SquareB
        style={{backgroundColor:"SlateBlue", color:"white", height:"40px", width:"100px"}}
        className="square"
        onClick={() => this.onSaveStatsHandler()}
        value="Save Stats"
      />
    );
  }

displayClearCell() {
  return (
    <SquareB
      style={{backgroundColor:"SlateBlue", color:"white", height:"40px", width:"100px"}}
      className="square"
      onClick={() => {var board = Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false}));
      var timeRBSFlag = false;
      var timeNRBSFlag = false;
      var puzzle=Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false}));
      this.setState({board: board, puzzle:puzzle, timeRBSFlag: timeRBSFlag, timeNRBSFlag: timeNRBSFlag})}}
      value="Clear"
    />
  );
}

  displaySolveCellRBS() {
    return (
      <SquareB
        style={{backgroundColor:"SlateBlue", color:"white", height:"50px", width:"240px"}}
        className="square"
        onClick={() => this.onSolveHandlerRBS()}
        value="Solve Using Recursive Backtracking Solver"
      />
    );
  }

  displaySolveCellNRBS() {
    return (
      <SquareB
        style={{backgroundColor:"SlateBlue", color:"white", height:"50px", width:"240px"}}
        className="square"
        onClick={() => this.onSolveHandlerNRBS()}
        value="Solve Using Iterative Backtracking Solver"
      />
    );
  }

render() {
  return (
    <div>
      <br></br>
      <div class="panel panel-default">
        <div class="panel-body" style={{ background: 'linear-gradient(to right, #e4a5a5 0%, #d47474 100%)',marginTop: '0px', marginBottom:'20px', paddingLeft: '20px', paddingTop: '25px', paddingBottom: '40px', textAlign: 'center'}}>
          <div className="board-row">
            {this.displayCellForm(0,0)}
            {this.displayCellForm(0,1)}
            {this.displayCellForm(0,2)}
            {this.displayCellForm(0,3,"Gainsboro")}
            {this.displayCellForm(0,4,"Gainsboro")}
            {this.displayCellForm(0,5,"Gainsboro")}
            {this.displayCellForm(0,6)}
            {this.displayCellForm(0,7)}
            {this.displayCellForm(0,8)}
          </div>
          <div className="board-row">
            {this.displayCellForm(1,0)}
            {this.displayCellForm(1,1)}
            {this.displayCellForm(1,2)}
            {this.displayCellForm(1,3,"Gainsboro")}
            {this.displayCellForm(1,4,"Gainsboro")}
            {this.displayCellForm(1,5,"Gainsboro")}
            {this.displayCellForm(1,6)}
            {this.displayCellForm(1,7)}
            {this.displayCellForm(1,8)}
          </div>
          <div className="board-row">
            {this.displayCellForm(2,0)}
            {this.displayCellForm(2,1)}
            {this.displayCellForm(2,2)}
            {this.displayCellForm(2,3,"Gainsboro")}
            {this.displayCellForm(2,4,"Gainsboro")}
            {this.displayCellForm(2,5,"Gainsboro")}
            {this.displayCellForm(2,6)}
            {this.displayCellForm(2,7)}
            {this.displayCellForm(2,8)}
          </div>
          <div className="board-row">
            {this.displayCellForm(3,0,"Gainsboro")}
            {this.displayCellForm(3,1,"Gainsboro")}
            {this.displayCellForm(3,2,"Gainsboro")}
            {this.displayCellForm(3,3)}
            {this.displayCellForm(3,4)}
            {this.displayCellForm(3,5)}
            {this.displayCellForm(3,6,"Gainsboro")}
            {this.displayCellForm(3,7,"Gainsboro")}
            {this.displayCellForm(3,8,"Gainsboro")}
          </div>
          <div className="board-row">
            {this.displayCellForm(4,0,"Gainsboro")}
            {this.displayCellForm(4,1,"Gainsboro")}
            {this.displayCellForm(4,2,"Gainsboro")}
            {this.displayCellForm(4,3)}
            {this.displayCellForm(4,4)}
            {this.displayCellForm(4,5)}
            {this.displayCellForm(4,6,"Gainsboro")}
            {this.displayCellForm(4,7,"Gainsboro")}
            {this.displayCellForm(4,8,"Gainsboro")}
          </div>
          <div className="board-row">
            {this.displayCellForm(5,0,"Gainsboro")}
            {this.displayCellForm(5,1,"Gainsboro")}
            {this.displayCellForm(5,2,"Gainsboro")}
            {this.displayCellForm(5,3)}
            {this.displayCellForm(5,4)}
            {this.displayCellForm(5,5)}
            {this.displayCellForm(5,6,"Gainsboro")}
            {this.displayCellForm(5,7,"Gainsboro")}
            {this.displayCellForm(5,8,"Gainsboro")}
          </div>
          <div className="board-row">
            {this.displayCellForm(6,0)}
            {this.displayCellForm(6,1)}
            {this.displayCellForm(6,2)}
            {this.displayCellForm(6,3,"Gainsboro")}
            {this.displayCellForm(6,4,"Gainsboro")}
            {this.displayCellForm(6,5,"Gainsboro")}
            {this.displayCellForm(6,6)}
            {this.displayCellForm(6,7)}
            {this.displayCellForm(6,8)}
          </div>
          <div className="board-row">
            {this.displayCellForm(7,0)}
            {this.displayCellForm(7,1)}
            {this.displayCellForm(7,2)}
            {this.displayCellForm(7,3,"Gainsboro")}
            {this.displayCellForm(7,4,"Gainsboro")}
            {this.displayCellForm(7,5,"Gainsboro")}
            {this.displayCellForm(7,6)}
            {this.displayCellForm(7,7)}
            {this.displayCellForm(7,8)}
          </div>
          <div className="board-row">
            {this.displayCellForm(8,0)}
            {this.displayCellForm(8,1)}
            {this.displayCellForm(8,2)}
            {this.displayCellForm(8,3,"Gainsboro")}
            {this.displayCellForm(8,4,"Gainsboro")}
            {this.displayCellForm(8,5,"Gainsboro")}
            {this.displayCellForm(8,6)}
            {this.displayCellForm(8,7)}
            {this.displayCellForm(8,8)}
          </div>
          <br></br>
          <div className="board-row">
            Game ID: {this.displayCellInputId(this.state.gameId)} &nbsp; Level:  {this.displayCellInputSelect(this.state.level)}
            &nbsp; &nbsp; {this.displaySaveStatsCell()}
          </div>
          <br></br>
          <div className="board-row">
            {this.displaySolveCellRBS()} <span style={ this.state.timeRBSFlag? {display: 'inline'} : {display: 'none'}}> {this.displayCellInput(this.state.timeRBS)} ms </span>
          </div>
          <br></br>
          <div className="board-row">
            {this.displaySolveCellNRBS()} <span style={ this.state.timeNRBSFlag? {display: 'inline'} : {display: 'none'}}> {this.displayCellInput(this.state.timeNRBS)} ms </span>
          </div>
          <br></br>
          <div className="board-row">
            {this.displayResetCell()}
          </div>
          <br></br>
          <div className="board-row">
            {this.displayClearCell()}
          </div>
        </div>
      </div>
    </div>
  );
}
}

class SudokuPuzzleSolver extends React.Component {
render() {
  return (
      <div>
      <h1> Sudoku Solver</h1>
        <Board />
      </div>
  );
}
}

export default SudokuPuzzleSolver;
