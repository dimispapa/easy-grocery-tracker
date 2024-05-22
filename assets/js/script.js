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
    alert("Please fill out the text box!")
    return false;
  } else {
    return true;
  }
};

// define function for adding new items
function addItem(event) {

  // Get the parent of the btn that triggered the event
  let triggerElement = event.currentTarget;
  let ul = triggerElement.parentElement.previousElementSibling;

  // get the user input text and apply trim method to ensure no spaces
  let inputBox = triggerElement.className === "add-item-btn" ? triggerElement.previousElementSibling : triggerElement;
  let userInput = inputBox.value.trim();

  // Validate input
  if (validateIfBlank(userInput) && validateIfDuplicate(userInput, ul)) {

    // define the list item along with a delete button,
    // using template literal with the user input text
    let newLi = `
    <li>
      <button class="tick-item-btn li-btn"><i class="fa-regular fa-circle"></i></button>
      <span>${userInput}</span>
      <button class="dlt-item-btn li-btn"><i class="fa-regular fa-trash-can"></i></button>
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
  icon.classList.toggle("ticked-shadow");
  icon.classList.toggle("fa-circle");

}

// define function for adding a new category
function addCategory(event) {

  // Get the parent of the btn that triggered the event
  let triggerElement = event.currentTarget;
  let newCatArea = triggerElement.parentElement;

  // get the user input text and apply trim method to ensure no spaces
  let inputBox = triggerElement.className === "add-category-btn" ? triggerElement.previousElementSibling : triggerElement;
  let userInput = inputBox.value.trim();

  // Validate input
  if (validateIfBlank(userInput)) {

    // define the HTML for a new category to be added, with areas to add new items/categories
    let newCat = `

    <!-- Add category area -->
    <div class="add-category-area">
      <!-- Add category input -->
      <input type="text" name="category" class="add-category" placeholder="Add new category">
      <!-- Add category button -->
      <button class="add-category-btn"><i class="fa-solid fa-basket-shopping"></i><i class="fa-solid fa-plus smaller-btn" id="smaller-btn"></i></button>
    </div>

    <!-- Category area -->
    <section class="category-area">

      <!-- Category header -->
      <h2 class="category-heading"><button class="toggle-list-btn category-btn"><i class="fa-solid fa-caret-down"></i></button> ${userInput} 
        <button class="dlt-category-btn category-btn"><i class="fa-regular fa-trash-can"></i></button>
      </h2>

      <!-- Shopping list area -->
      <ul class="shop-list">
      </ul>

      <!-- Add item area -->
      <div class="add-item-area">
        <!-- Add item input -->
        <input type="text" name="item" class="add-item" placeholder="Add grocery item">
        <!-- Add item button -->
        <button class="add-item-btn"><i class="fa-solid fa-cart-plus"></i></button>
      </div>

    </section>
    `;

    // append the new li item to the ul
    newCatArea.insertAdjacentHTML('beforebegin', newCat);

    // clear the input box
    inputBox.value = '';

    // update event listeners based on latest DOM
    updateEventListeners()

  };
}

// Define function for toggling category list visibility
function toggleList(event) {

  // get category list to target and the add-item area
  let listArea = event.currentTarget.parentElement.nextElementSibling;
  let addItemArea = listArea.nextElementSibling;

  // show or hide the div based on the current state of the display style
  listArea.style.display = listArea.style.display === 'none' ? 'block' : 'none';
  addItemArea.style.display = addItemArea.style.display === 'none' ? 'block' : 'none';
};

// define Delete category function
function deleteCategory(event) {

  // target the category area and the addCategory area preceding it
  let catArea = event.currentTarget.parentElement.parentElement;
  let newCatAreaAbove = catArea.previousElementSibling;
  newCatAreaAbove.remove();
  catArea.remove();
}

// define a function to handle keyboard events
function handleKeyEvents(event) {
  // if enter key was pressed down
  if (event.key === "Enter" && this.className === "add-category") {
    // run addcategory function
    addCategory(event);
  } else if (event.key === "Enter" && this.className === "add-item") {
    // run additem function
    addItem(event);
  }
}

// define reusable function for updating event listeners when new buttons are added
function updateEventListeners() {

  // get the latest array of buttons
  let buttons = document.getElementsByTagName('button');

  // add event listeners for buttons based on class
  for (let button of buttons) {
    if (button.classList.contains("add-item-btn")) {

      // add event listener for adding items
      button.addEventListener("click", addItem);

    } else if (button.classList.contains("dlt-item-btn")) {

      // add event listener for deleting items
      button.addEventListener("click", deleteItem);

    } else if (button.classList.contains("tick-item-btn")) {

      // add event listener for ticking-off items
      button.addEventListener("click", tickItem);

    } else if (button.classList.contains("toggle-list-btn")) {

      // add event listener for ticking-off items
      button.addEventListener("click", toggleList);

      // add event listener for adding new category
    } else if (button.classList.contains("add-category-btn")) {

      // add event listener for ticking-off items
      button.addEventListener("click", addCategory);

      // add event listener for deleting categories
    } else if (button.classList.contains("dlt-category-btn")) {

      // add event listener for ticking-off items
      button.addEventListener("click", deleteCategory);
    }
  };

  // get the latest array of input boxes
  let inputBoxes = document.getElementsByTagName('input');

  // add enter keydown event listeners to input boxes
  for (let input of inputBoxes) {
    input.addEventListener("keypress", handleKeyEvents);
  };
};

// add initial eventListeners once the page has loaded
window.onload = updateEventListeners();