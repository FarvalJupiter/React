import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className= props.winningsquare ? "winning-square square" : "square"
    return (
      <button className={className}
      onClick={props.onClickX}>
      {props.value1}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (<Square 
    value1={this.props.squares[i]}
    winningsquare={this.props.winningsquare? this.props.winningsquare[0]===i ||this.props.winningsquare[1]===i || this.props.winningsquare[2]===i:false}
    onClickX={()=>this.props.onClickY(i)}/>);
  }
  CreateBoard=()=>{
    let table=[];
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
      let children = []
      //Inner loop to create children
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(i*3+j))
      }
      //Create the parent and add the children
      table.push(<div key={i} className="board-row">{children}</div>)
    }
    return table
  }
  render() {
    return (
      <div>
        {this.CreateBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history:[{
        squares:Array(9).fill(null),
        coordinate:'1,1',
    }],
    sortstate:'desc',
    stepNumber:0,
    xIsNext:true,}
  }

  handleClick(i){
    const history=this.state.history.slice(0, this.state.stepNumber+1);
    const current=history[history.length-1];
    const squares=current.squares.slice();
    if(calculateWinner(squares)||squares[i]){
      return;
    }
    squares[i]=this.state.xIsNext ? 'X':'O';
    this.setState({
      history:history.concat([{squares:squares, coordinate:setCoordinate(i)}]),
      stepNumber:history.length,
      xIsNext:!this.state.xIsNext});
  }
  sort(){
    this.setState({sortstate: this.state.sortstate==='desc'? 'asc':'desc'});
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:(step%2)===0})
  }
  render() {
    const history=this.state.history;
    const current=history[this.state.stepNumber];
    const winner=calculateWinner(current.squares);

    const moves=history
     .map((step,move)=>{
      const desc=move ? 'Go to move #' +move +' Coordinate '+step.coordinate  :'Go to game start';
      const cssclass=this.state.stepNumber===move ? 'bold':'';
      return(<li className= {cssclass} key={move}><button className={cssclass} onClick={() =>this.jumpTo(move)}>{desc}</button> </li>)
    })
    .sort((a, b) => this.state.sortstate==='desc' ? a.key > b.key : a.key < b.key);
    let status;
    if(winner){
      status='Winner '+current.squares[winner[0]]
    }
    else if(this.state.stepNumber>8){
      status = 'No one wins, the result is a draw';

    }
    else{
      status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          winningsquare={winner}
          onClickY={(i)=>this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={()=>this.sort()}>Sort</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function setCoordinate(i){
  return i===0 ? '1,1' : i===1 ? '2,1' : i===2 ? '3,1' : i===3 ? '1,2': i===4 ?'2,2' : i===5 ? '3,2' : i===6 ? '1,3' : i===7 ? '2,3' : i===8 ? '3,3':'5,5'
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
     // return squares[a];
      return [a, b, c];
    }
  }
  return null;
}