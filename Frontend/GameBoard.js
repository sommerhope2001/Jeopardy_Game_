const oneHundred = document.querySelector('.twoH'); //Select 200 pt class
const twoHundred = document.querySelector('.fourH'); //Select 400 pt class
const threeHundred = document.querySelector(".sixH"); //600 pt class
const fourHundred = document.querySelector(".eightH"); //800 pt class
const fiveHundred = document.querySelector(".thou"); //1000 pt class

let buttonElements = ''; //To hold the button objects
let buttonArray = []; //Hold all button objects in an array together
let str = ''; //This string will be used to hold each button element id

let i;
for (i = 0; i < 29; i++) {
    str = i.toString(); //Convert i to string value since button id's are string values
    buttonElements = document.getElementById(str); //Get each button id
    buttonArray.push(buttonElements); //Push each button object into the button array
    console.log(buttonArray[i]);

}


// JSON file of generated questions
const generatedQuestions = JSON.parse(sessionStorage.getItem('generatedQuestions')) || [];
console.log(generatedQuestions);