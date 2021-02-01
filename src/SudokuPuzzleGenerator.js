import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
        solution: Array(9).fill().map(() => new Array(9).fill({value:undefined,pencilMark:[],visited:[]})),
        puzzle: Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false})),
        board: Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false})),
        saved_board:Array(9).fill().map(() => new Array(9).fill({value:undefined,given:false})),
        cellCheck: Array(9).fill(false).map(() => new Array(9).fill(false)),
        buttonText:"See Solution",
        playButtonText:"Play"
      };
  }

  onPlayAgainHandler() {
    var solution       = this.getSolution();
    var puzzle         = this.getUniquePuzzle(solution);
    var playButtonText = "Play Again";
    var board          = this.deepCopy(puzzle);
    var buttonText     = "See Solution";
    var cellCheck      = Array(9).fill(false).map(() => new Array(9).fill(false));

    this.setState({puzzle: puzzle, board: board, solution: solution, playButtonText: playButtonText, buttonText: buttonText, cellCheck: cellCheck}, function () {
      //console.log('in onPlayAgainHandler b',this.state.board);
      //console.log('in onPlayAgainHandler pu',this.state.puzzle);
    });
  }

  getSolution(){
    var nrows = 9;
    var ncols = 9;
    var squares =new Array(nrows);

    for (var i=0;i<nrows;i++) {
      squares[i]=new Array(ncols)
    }

    for (var i=1;i<nrows;i++) {
       for (var j=0;j<nrows;j++) {
         squares[i][j] = {value:undefined,pencilMark:[]};
       }
    }

    const rowOneSeed = [...Array(9).keys()].map(x => ++x);
    this.shuffleArray(rowOneSeed);
    for(let i=0; i<rowOneSeed.length; i++){
        squares[0][i] = {value:rowOneSeed[i],pencilMark:[]};
    }

    var numbers = [];

    for(let r=1; r<nrows; r++){
      for(let c=0; c<ncols; c++){
          numbers = this.validPencilMarks(r,c,squares);

          if(numbers.length!=0){
              var randIndex = Math.floor(Math.random() * (numbers.length-1));

              var val = numbers[randIndex];
              squares[r][c].value = val;
              numbers.splice(randIndex,1);

              for(let rn=0; rn<numbers.length; rn++){
                squares[r][c].pencilMark.push(numbers[rn]);
              }

          } else {
            while(r!=0){
              c--;
              if(c<0){r--;c=ncols-1}
              if(r<=0){break;}

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
    return squares;
  }

  getUniquePuzzle(solvedPuzzle){
    var nrows        = 9;
    var ncols        = 9;
    var location;

    var puzzle       = new Array(nrows);

    for (var i=0;i<nrows;i++) {
      puzzle[i]=new Array(ncols)
    }

    for (var i=0;i<nrows;i++) {
       for (var j=0;j<nrows;j++) {
         puzzle[i][j] = {value:solvedPuzzle[i][j].value,given:true};
       }
    }

    var locationArray = [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
                         [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],
                         [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
                         [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],
                         [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8],
                         [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],
                         [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],
                         [7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],
                         [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8]];

    this.shuffleArray(locationArray);

    location = locationArray.pop();

    var cntr=0;

    while(locationArray.length != 0){
      cntr++;
      puzzle[location[0]][location[1]].value = undefined;
      puzzle[location[0]][location[1]].given = false;
      if(this.uniqueSolve(puzzle)==false){
        puzzle[location[0]][location[1]].value = solvedPuzzle[location[0]][location[1]].value;
        puzzle[location[0]][location[1]].given = true;
      }
      if(cntr==54){break;}
      location = locationArray.pop();
   }

   return puzzle;
  }

  uniqueSolve(puzzle){
    var solutions =[];
    this.solveSudoku(0,0,solutions,puzzle);
    var numSolutions = solutions.length;
    if(numSolutions==0 || numSolutions>1){return false;}
    else {return true;}
  }

  solveSudoku(row, col, solutions, board){
    if(row>=9){
      //solutions.push(this.deepCopy(board));
      solutions.push(1);
      return;
    }

    while(board[row][col].given == true){
      col = col+1;
      row = (col<=8)?row:row+1;
      col = (col<=8)?col:0;
      if(row==9){
      //solutions.push(this.deepCopy(board));
      solutions.push(1);
      return;}
    }

    var pencilMarks = this.validPencilMarks(row,col,board);

    var c = col+1;
    var r = (c<=8)?row:row+1;
        c = (c<=8)?c  :0;

    for(let i=0; i<pencilMarks.length && solutions.length <=1; i++){
      board[row][col].value = pencilMarks[i];
      board[row][col].given = true;
      this.solveSudoku(r,c,solutions,board);
    }
    board[row][col].value = undefined;
    board[row][col].given = false;
    return;
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

  onSeeSolutionsHandler(){
    var buttonText = this.state.buttonText;
    var cellCheck =  Array(9).fill(false).map(() => new Array(9).fill(false));
    var saved_board;
    var board;

    if(buttonText == "See Solution"){
      buttonText  = "Back To Puzzle";
      saved_board = this.deepCopy(this.state.board);
      board       = this.deepCopy(this.state.solution);
    } else {
      buttonText  = "See Solution";
      board       = this.deepCopy(this.state.saved_board);
    }

    this.setState({board: board, saved_board: saved_board, buttonText: buttonText, cellCheck: cellCheck}, function () {
    console.log('in onSeeSolutionsHandler b',this.state.board);
    console.log('in onSeeSolutionsHandler s',this.state.solution);
      // console.log('in onSeeSolutionsHandler sb',this.state.saved_board);
    });
  }

  onCellCheckHandler(){
    var board      = this.deepCopy(this.state.board);
    var solution   = this.deepCopy(this.state.solution);
    var cellCheck  = this.state.cellCheck.slice();
    var saved_board;
    var board;

    for (var i=0;i<board.length;i++) {
       for (var j=0;j<board[0].length;j++) {
         if(board[i][j].value != undefined){
           if(board[i][j].value != solution[i][j].value){
             cellCheck[i][j]=true;
           }
         }
       }
    }

    this.setState({cellCheck: cellCheck}, function () {
      // console.log('in onCellCheckHandler b',cellCheck);
    });
  }

  valChangeHandler = (i,j,event) => {
    const board  = this.deepCopy(this.state.board);

    if(event.target.value){
      board[i][j].value = Number(event.target.value);
    } else {
      board[i][j].value = undefined;
    }
    this.setState({board: board}, function () {
      //console.log('in val b',this.state.board);
    });
  }

  displayCellForm(i,j,bg="white") {
    return (
      <SquareF
        readOnlyVal={this.state.puzzle[i][j]?this.state.puzzle[i][j].given:false}
        styleSettings={{fontWeight: this.state.puzzle[i][j].given? 'bold' : 'normal', color:this.state.cellCheck[i][j]? "red" :"black", height:"50px", width:"50px", backgroundColor:bg, textAlign: 'center'}}
        keyValue={this.state.board[i][j]?this.state.board[i][j].value+'['+i+']'+'['+j+']':undefined}
        defaultValue={this.state.board[i][j]?this.state.board[i][j].value:""}
        onChange={(event) => this.valChangeHandler(i,j,event)}
        onClick={ () => {const cellCheck =  Array(9).fill(false).map(() => new Array(9).fill(false));
          this.setState({cellCheck: cellCheck})  }}
      />
    );
  }

  displayPlayAgainCell() {
    return (
      <SquareB
        style={{backgroundColor:"DarkOrange", color:"white", height:"40px", width:"140px"}}
        className="square"
        onClick={() => this.onPlayAgainHandler()}
        value={this.state.playButtonText}
      />
    );
  }

  displaySeeSolutionsCell() {
    return (
      <SquareB
        style={{backgroundColor:"DarkOrange", color:"white", height:"40px", width:"140px"}}
        className="square"
        onClick={() => this.onSeeSolutionsHandler()}
        value={this.state.buttonText}
      />
    );
  }

  displayCellCheck() {
    return (
    <SquareB
      style={{backgroundColor:"DarkOrange", color:"white", height:"40px", width:"140px"}}
      className="square"
      onClick={() => this.onCellCheckHandler()}
      value="How am I doing?"
    />
  );
  }

  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (array.length));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
render() {
  return (
    <div>
    <div class="panel panel-default">
      <div class="panel-body" style={{ background: 'linear-gradient(to right, #99ccff 0%, #48d1cc 100%)',marginTop: '0px', marginBottom:'20px', paddingLeft: '20px', paddingTop: '25px', paddingBottom: '40px', textAlign: 'center'}}>
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
          {this.displayPlayAgainCell()}
        </div>
        <br></br>
        <div className="board-row">
          {this.displaySeeSolutionsCell()}
        </div>
        <br></br>
        <div className="board-row">
          {this.displayCellCheck()}
        </div>
      </div>
    </div>
  </div>
  );
}
}

class SudokuPuzzleGenerator extends React.Component {
render() {
  return (
      <div>
        <h1> Sudoku </h1>
        <Board />
      </div>
  );
}
}

export default SudokuPuzzleGenerator;
