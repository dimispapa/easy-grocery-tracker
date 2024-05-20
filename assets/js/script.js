// define function to check for duplicate list item
function validateIfDuplicate(userInput, ulElement) {

  // get array of li elements in ul
  let items = ulElement.getElementsByTagName('span');

  // check if ul has at least one li element
  if (items.length !== 0) {

    // loop through li elements to check if new text input exists
    for (let item of items) {

      // check for a case insesitive match
      if (item.textContent.toLowerCase().trim() === userInput.toLowerCase().trim()) {
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

  // Get the button that triggered the event and the ul element before it
  let button = event.target;
  let ul = button.parentElement.previousElementSibling;

  // get the user input text and apply trim method to ensure no spaces
  let inputBox = button.previousElementSibling
  let userInput = inputBox.value.trim();

  // Validate input
  if (validateIfBlank(userInput) && validateIfDuplicate(userInput, ul)) {

    // define the list item along with a delete button,
    // using template literal with the user input text
    let newLi = `
    <li>
      <button class="tick-item-btn">Tick</button>
      <span>${userInput}</span>
      <button class="dlt-item-btn">Delete</button>
    </li>
    `;

    // append the new li item to the ul
    ul.insertAdjacentHTML('beforeend', newLi);

    // clear the input box
    inputBox.value = '';

    // update event listeners based on latest DOM
    updateEventListeners()
  };

};

// add Delete function for delete button
function deleteItem(event) {

  // target the li element that the button is a child of
  let li = event.target.parentElement;
  li.remove();
}

// add Tick function for items that have been fulfilled
function tickItem(event) {

  // target the span element that is the next sibling of the trigger button
  let span = event.target.nextElementSibling;

  // toggle on/off the class to apply/remove line-through text decoration
  span.classList.toggle('ticked-off');

}

function updateEventListeners() {

  // get the latest array of buttons
  let buttons = document.getElementsByTagName('button');
  console.log(buttons.length);

  // add event listeners for buttons based on class
  for (let button of buttons) {
    if (button.className === "new-item-btn") {

      // add event listener for adding items
      button.addEventListener("click", addItem);

    } else if (button.className === "dlt-item-btn") {

      // add event listener for deleting items
      button.addEventListener("click", deleteItem);

    } else if (button.className === "tick-item-btn") {

      // add event listener for ticking-off items
      button.addEventListener("click", tickItem);
    }
  };
}

// add initial eventListeners once the page has loaded
window.onload = updateEventListeners();