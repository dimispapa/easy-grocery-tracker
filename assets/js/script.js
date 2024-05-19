// define function to validate inputs
function validateUserInput(userInput) {
  if (userInput == "") {
    alert("Item must be filled out")
    return false;
  } else {
    return true;
  }
};

// define function for adding new items
function addItem(event) {

  // Get the button that triggered the event
  let button = event.target;

  // get the input element and user entry
  let userInput = button.previousElementSibling.value
  if (validateUserInput(userInput)) {

    // Get the next sibling element (the ul element)
    let ul = button.nextElementSibling;

    // add li item with user entry text
    let newLi = document.createElement('li');
    newLi.textContent = userInput;
    ul.appendChild(newLi);
  };

};

// get an array of buttons
let buttons = document.getElementsByTagName('button');
console.log(buttons.length);

// add event listeners for buttons
for (let button of buttons) {
  if (button.className === "new-item-btn") {
    // add event listener for adding items
    button.addEventListener("click", addItem);
  }
};