const oneHundred = document.querySelector('.twoH'); //Select 200 pt class
const twoHundred = document.querySelector('.fourH'); //Select 400 pt class
const threeHundred = document.querySelector(".sixH"); //600 pt class
const fourHundred = document.querySelector(".eightH"); //800 pt class
const fiveHundred = document.querySelector(".thou"); //1000 pt class

//Variable holds modal class
const modal = document.querySelector('.modal')

//Variable for the overlay class
const overlay = document.querySelector('.overlay');

//Variable for close modal button
const btnCloseModal = document.querySelector('.close-modal');


let buttonElements = ''; //To hold the button objects
let buttonArray = []; //Hold all button objects in an array together
let str = ''; //This string will be used to hold each button element id


// Do a query selector for each button
let i;
for (i = 0; i < 30; i++) {
    str = i.toString(); //Convert i to string value since button id's are string values
    buttonElements = document.getElementById(str); //Get each button id
    buttonArray.push(buttonElements); //Push each button object into the button array
}



// Add event listeners to each button
let questions;
for (let i = 0; i < buttonArray.length; i++){

    // When the button is clicked, open the model window to display the question
    buttonArray[i].addEventListener('click', function () {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');

    // Add an event listener to close model
    btnCloseModal.addEventListener('click', async () => {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');

    });

});
}





// JSON file of generated questions
const generatedQuestions = JSON.parse(sessionStorage.getItem('generatedQuestions')) || [];
console.log(generatedQuestions);

console.log(buttonArray)


// Mapping buttons to chatgpt generated questions and answers to buttons

//const buttonToQA = 