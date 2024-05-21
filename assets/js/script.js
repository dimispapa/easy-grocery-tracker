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
  let button = event.currentTarget;
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
      <button class="tick-item-btn"><i class="fa-regular fa-circle"></i></button>
      <span>${userInput}</span>
      <button class="dlt-item-btn"><i class="fa-regular fa-trash-can"></i></button>
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

// define Delete function for delete button
function deleteItem(event) {

  // target the li element that the button is a child of
  let li = event.currentTarget.parentElement;
  li.remove();
}

// define Tick function for items that have been fulfilled
function tickItem(event) {

  // target the span element that is the next sibling of the trigger button
  let span = event.currentTarget.nextElementSibling;

  // toggle on/off the class to apply/remove line-through text decoration
  span.classList.toggle('ticked-off');

  // target icon of the tick button
  let icon = event.currentTarget.getElementsByTagName('i')[0];

  // togglee icon with checked circle or unchecked circle
  icon.classList.toggle("fa-circle-check");
  icon.classList.toggle("fa-circle");

}

// define reusable function for updating event listeners when new buttons are added
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

    } else if (button.className === "toggle-list-btn") {

      // add event listener for ticking-off items
      button.addEventListener("click", toggleList);
    }
  };
}

// Define function for toggling category list visibility
function toggleList(event) {

  // get category list to target
  let categoryArea = event.currentTarget.parentElement.nextElementSibling;

  // show or hide the div based on the current state of the display style
  categoryArea.style.display = categoryArea.style.display === 'none' ? 'block' : 'none';
};

// add initial eventListeners once the page has loaded
window.onload = updateEventListeners();