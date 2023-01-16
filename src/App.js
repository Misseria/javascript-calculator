import React from 'react';
//import ReactDOM from 'react-dom/client';
import "./App.css";

function App() {
  return (
    <table cellSpacing="0" className='spacer'>
      <tbody>
        <tr><td className='filler'></td></tr>
        <tr><td><Calc></Calc></td></tr>
        <tr><td className='filler'></td></tr>
      </tbody>
    </table>
  );
}

class Calc extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      display: "0",
      history: "",
      oprg: /[*/+-]$/,
      num: /[0-9]+/,
      dec: /[0-9]+\.[0-9]*/,
      justequaled: false
    }

    this.handleClick = this.handleClick.bind(this);
    this.Dot = this.Dot.bind(this);
    this.Operation = this.Operation.bind(this);
    this.Digit = this.Digit.bind(this);
    this.Equal = this.Equal.bind(this);
    this.Clear = this.Clear.bind(this);
    this.Delete = this.Delete.bind(this);
  }

  handleClick(e){
    let cal = /([0-9]+\.*[0-9]*)|([+*/-]+)/g;
    let array = this.state.display.match(cal);
    let last = array.pop(); //gets last number or operators displayed

    switch(e.target.id){
      case "one":
        this.Digit("1", last, array);
        break;
      case "two":
        this.Digit("2", last, array);
        break;
      case "three":
        this.Digit("3", last, array);
        break;
      case "four":
        this.Digit("4", last, array);
        break;
      case "five":
        this.Digit("5", last, array);
        break;
      case "six":
        this.Digit("6", last, array);
        break;
      case "seven":
        this.Digit("7", last, array);
        break;
      case "eight":
        this.Digit("8", last, array);
        break;
      case "nine":
        this.Digit("9", last, array);
        break;
      case "zero":
        this.Digit("0", last, array);
        break;
      case "add":
        this.Operation(last, "+", array);
        break;
      case "subtract":
        this.Operation(last, "-", array);
        break;
      case "multiply":
        this.Operation(last, "*", array);
        break;
      case "divide":
        this.Operation(last, "/", array);
        break;
      case "decimal":
        this.Dot(last);
        break;
      case "equals":
        this.Equal(last, array);
        break;
      case "clear":
        this.Clear();
        break;
      case "delete":
        this.Delete(last, array);
        break;
      case "magic":
        break;
      default:
        break;
    }
  }

  Dot (last) {
    //if equal was pressed just before the dot, display will be set to "0"
    if (this.state.justequaled){
      this.setState({
        display: "0",
        justequaled: false
      })

      last = "0";

    }

    /*if last is a decimal, nothing will happen
    if last is a number, a dot will be added
    else, add "0."*/
    if (this.state.dec.test(last)){
      return;
    } else if (this.state.num.test(last)){
      this.setState({
        display: this.state.display + "."
      })
    } else {
      this.setState({
        display: this.state.display + "0."
      })
    }
  }

  Operation (last, input, array) {
    if (this.state.justequaled){
      this.setState({
        justequaled: false
      })
    }

    /*if there was "*" or "/" and minus was pressed, it will be added,
    if there was "*-" or "/-" and minus was pressed, nothing will happen.
    if there was "+" or "-" or "0", it will be replaced by whats being pressed
    otherwise the input will be added */
    if (/^[/*]/.test(last)){
      if (input === "-"){
        if (/-$/.test(last)){
          return;
        }
        this.setState({
          display: this.state.display + "-"
        })
      } else {
        this.setState({
          display: array.join("") + input
        })
      }
    } else if (/[+-]/.test(last) || last === "0"){
      this.setState({
        display: array.join("") + input
      })
    } else {
      this.setState({
        display: this.state.display + input
      })
    }
  }

  Digit (input, last, array) {
    //if equal was pressed just before the digit, display will be set to "0"
    if (this.state.justequaled){
      this.setState({
        display: "0",
        justequaled: false
      })

      last = "0";
    }

    /*if last is "0", it will be replaced by the digit,
    otherwise nothing will get replaced and digit will be added*/
    if (last === "0") {
      this.setState({
        display: array.join("") + input
      })
    } else {
    this.setState({
      display: this.state.display + input
    })
    }
  }

  Clear () {
    this.setState({
      display: "0"
    })
  }

  Delete (last, array) {
    if(!array.length && !last.slice(0, -1)){
      this.setState({
        display: "0"
      })
    } else {
      this.setState({
        display: array.join("") + last.slice(0, -1)
      })
    }
  }

  Equal (last, array) {
    array.push(last);

    //if "-" is the first element, make the second element negative and delete first
    if (array[0] === "-"){
      array[1] = "-" + array[1];
      array.shift();
    }
    //if the first element is an operator, delete it
    if (this.state.oprg.test(array[0])){
      array.shift();
    }
    //if the last element is an operator, delete it
    if (this.state.oprg.test(array[array.length-1])){
      array.pop()
    }

    /*makes negative numbers and turns numbers into number type
    ex: ["5", "*-", "5"] => [5, "*", -5]*/
    for (let el = 0; el < array.length; el++) {
      if(array[el] === "*-"){
        array[el] = "*";
        array[el + 1] = "-" + array[el + 1];
      } else if(array[el] === "/-"){
        array[el] = "/";
        array[el + 1] = "-" + array[el + 1];
      }

      if(Number(array[el])){
        array[el] = Number(array[el]);
      }
    }

    this.setState({
      display: this.RealMath(array).toString(),
      justequaled: true
    })
  }

  //does the real math
  RealMath (array) {
    while(array.length !== 1){
      let res;
      switch (array[1]){
        case "+":
          res = array[0] + array[2];
          break;
        case "-":
          res = array[0] - array[2];
          break;
        case "*":
          res = array[0] * array[2];
          break;
        case "/":
          res = array[0] / array[2];
          break;
      }
      array.splice(0, 2);
      array[0] = res;
    }

    return array[0];
  }

  render(){
    return (
      <table onClick={this.handleClick} cellSpacing="0" className='main'>
        <tbody>
          <tr>
            <th colSpan="5" id='display'>{this.state.display}</th>
          </tr>
          <tr>
            <td colSpan="3" id='clear'>AC</td>
            <td colSpan="2" id="delete">D</td>
          </tr>
          <tr>
            <td rowSpan="3" id='equals'>=</td>
            <td id='one'>1</td>
            <td id='two'>2</td>
            <td id='three'>3</td>
            <td id='add'>+</td>
          </tr>
          <tr>
          <td id='four'>4</td>
          <td id='five'>5</td>
          <td id='six'>6</td>
          <td id='subtract'>-</td>
          </tr>
          <tr>
          <td id='seven'>7</td>
          <td id='eight'>8</td>
          <td id='nine'>9</td>
          <td id='multiply'>*</td>
          </tr>
          <tr>
          <td id="magic">
            <i className="fa-regular fa-flask-round-potion"></i>
          </td>
          <td colSpan="2" id="zero">0</td>
          <td id='decimal'>.</td>
          <td id='divide'>/</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

//ReactDOM.render(App, document.getElementById("root"));

export default App;
