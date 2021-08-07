
var sudogen = require('sudoku-gen');
const easyGen = sudogen.getSudoku("easy")
const mediumGen = sudogen.getSudoku("medium")
const hardGen = sudogen.getSudoku("hard")

const easy = [
    Object.values(easyGen)[0],
    Object.values(easyGen)[1]
];
const medium = [
    Object.values(mediumGen)[0],
    Object.values(mediumGen)[1]
];
const hard = [
    Object.values(hardGen)[0],
    Object.values(hardGen)[1]
];

var timer;
var timeRemaining;
var selectedTile;
var disableSelect;
var selectedNum;

window.onload = function(){
    //Run startgame function when button is clicked
    id("start-button").addEventListener("click", startGame);
}

function startGame(){
    console.log(hard[0]);
}

function id(id){
    return document.getElementById(id);
}