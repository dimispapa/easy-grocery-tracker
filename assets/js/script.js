// define function to check for duplicate list item
function validateIfDuplicate(userInput, ulElement) {
  // get array of li elements in ul
  let items = ulElement.getElementsByTagName('li');
  // check if ul has at least one li element
  if (items.length !== 0) {
    // loop through li elements to check if new text input exists
    for (let item of items) {
      // check for a case insesitive match
      if (item.textContent.toLowerCase() === userInput.toLowerCase()) {
        alert('This item already exists in the list!');
        return false;
      }
    }
  }
  // default return as true if no duplicate found in loop
  return true;
};

// define function to validate if blank
function validateIfBlank(userInput) {
  // if input is empty string/blank
  if (userInput == "") {
    alert("Item must be filled out!")
    return false;
  } else {
    return true;
  }
};

// define function for adding new items
function addItem(event) {

  // Get the button that triggered the event and the ul element next to it
  let button = event.target;
  let ul = button.parentElement.nextElementSibling;

  // get the user input text and apply trim method to ensure no spaces
  let userInput = button.previousElementSibling.value.trim();

  // Validate input
  if (validateIfBlank(userInput) && validateIfDuplicate(userInput, ul)) {

    // define the list item along with a delete button,
    // using template literal with the user input text
    let newLi = `
    <li>
      ${userInput}
      <button class="dlt-item-btn">Delete</button>
    </li>
    `;

    // append the new li item to the ul
    ul.insertAdjacentHTML('beforeend', newLi);
  };

};

// add Delete function for delete button
function deleteItem(event) {
  // target the li element that the button is a child of
  let li = event.target.parentElement;
  li.remove();
}

// get an array of buttons
let buttons = document.getElementsByTagName('button');
console.log(buttons.length);

// add event listeners for buttons
for (let button of buttons) {
  if (button.className === "new-item-btn") {
    // add event listener for adding items
    button.addEventListener("click", addItem);
  } else if (button.className === "dlt-item-btn") {
    // add event listener for deleting items
    button.addEventListener("click", deleteItem);
  }
};