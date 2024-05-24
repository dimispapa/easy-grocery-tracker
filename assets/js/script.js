// ****** FUNCTIONS FOR SAVING/LOADING USER DATA AND RECREATING THE DOM AS THE USER LEFT IT ******

// add event listener on page load
document.addEventListener('DOMContentLoaded', function () {

  try {
    // load the grocery list when the page is loaded
    loadGroceryList();

    // update the event listeners for key functionality
    updateEventListeners();

  } catch (error) {
    console.error('Error during initialization:', error);
  }

});

// define function for saving data to local storage in json format
function saveDataToLocalStorage(key, data) {

  try {
    localStorage.setItem(key, JSON.stringify(data));

  } catch (error) {
    console.error('Error saving to local storage:', error);
  }


}

// define function for loading data from local storage
function loadDataFromLocalStorage(key, data) {

  try {
    // get data item from local storage
    const LOCALDATA = localStorage.getItem(key);

    // return data parse from json if it exists otherwise return null
    return LOCALDATA ? JSON.parse(LOCALDATA) : null;

  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  }

}

// define function to extract the data from the dom, process it in objects and save it
function saveGroceryList() {

  try {
    // parse the category areas into a node list
    const CATEGORIES = document.querySelectorAll('.category-area');
    // create an empty grocery list array to store data
    let groceryList = [];

    // loop through each category area
    for (let category of CATEGORIES) {

      // extract the category heading name
      let categoryName = category.querySelector('.category-heading').textContent.trim();
      // create an empty items array to store data
      let items = [];

      // get the list items from the DOM
      const LISTITEMS = category.querySelectorAll('li');

      // loop through each list item
      for (let li of LISTITEMS) {

        // extract the item name from the span child
        let itemName = li.querySelector('span').textContent.trim();

        // get the state of the item if it is ticked-off or not
        let isTicked = li.querySelector('span').classList.contains('ticked-off');

        // store the item object in the items array
        items.push({
          item_name: itemName,
          ticked: isTicked
        });

      };

      // store the category object with the nested items array, in the overarching grocery list array
      groceryList.push({
        category: categoryName,
        items: items
      });

    };

    // finally save the grocery list data to local storage
    saveDataToLocalStorage('grocery_list', groceryList)

  } catch (error) {
    console.error('Error saving grocery list:', error);
  }
};

// define function that loads grocery list data from local storage
function loadGroceryList() {

  try {
    // attempt to load data from local storage using the key "grocery_list"
    const GROCERYLIST = loadDataFromLocalStorage('grocery_list');
    // if no data exists, then return nothing
    if (!GROCERYLIST) return;

    // loop through the categories in the data
    for (let categoryData of GROCERYLIST) {

      // call the function that populates the DOM with containing the data
      populateListFromData(categoryData.category, categoryData.items);

    };

  } catch (error) {
    console.error('Error loading grocery list:', error);
  }

};

// define function that builds the html template literals and inserts into the DOM
function populateListFromData(categoryName, items) {

  try {
    // build the html structure using template literal with the category name from the data
    let loadCat = `
    <section class="category-area" id="${categoryName}-area">
      <h2 class="category-heading"><button class="toggle-list-btn category-btn"><i class="fa-solid fa-caret-down"></i></button> ${categoryName} 
        <button class="dlt-category-btn category-btn"><i class="fa-regular fa-trash-can"></i></button>
      </h2>
      <ul class="shop-list"></ul>
      <div class="add-item-area">
        <input type="text" name="item" class="add-item" placeholder="Add grocery item">
        <button class="add-item-btn"><i class="fa-solid fa-cart-plus"></i></button>
      </div>
    </section>
    <div class="add-category-area">
    <input type="text" name="category" class="add-category" placeholder="Add new category">
    <button class="add-category-btn"><i class="fa-solid fa-basket-shopping"></i><i class="fa-solid fa-plus smaller-btn" id="smaller-btn"></i></button>
    </div>
    `;

    // insert the loaded category area in the app area main
    let mainAppArea = document.getElementById('app-area');
    mainAppArea.insertAdjacentHTML('beforeend', loadCat);

    // check if there are any items
    if (items.length !== 0) {
      // get the ul element by referring to the last child (newly inserted category area) of the app area
      let ul = document.getElementById(`${categoryName}-area`).querySelector('ul');

      // loop through items in the data and insert html li elements in the ul
      for (let item of items) {

        // define li element using item variable names and ticked-off status
        // use a ternary operator within the template literal to conditionally set the ticked-off class
        let loadLi = `
      <li>
        <button class="tick-item-btn li-btn"><i class="fa-regular fa-circle"></i></button>
        <span class="${item.isTicked ? 'ticked-off': ''}">${item.item_name}</span>
        <button class="dlt-item-btn li-btn"><i class="fa-regular fa-trash-can"></i></button>
      </li> 
      `;

        // insert the li element in the ul list
        ul.insertAdjacentHTML('beforeend', loadLi);
      };
    };
    // update the event listeners on the new updated DOM
    updateEventListeners();

  } catch (error) {
    console.error('Error populating lists from local data:', error);
  }
};

// ****** FUNCTIONALITY CODE FOR MANIPULATING THE DOM *******

// define function to check for duplicate list item
function validateIfDuplicate(userInput, ulElement) {
  try {
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
        };
      };
    };
    // default return as true if no duplicate found in loop
    return true;
  } catch (error) {
    console.error('Error validating user input for duplicates:', error)
  };
};

// define function to validate if blank
function validateIfBlank(userInput) {

  try {
    // if input is empty string/blank
    if (userInput == "") {
      alert("Please fill out the text box!")
      return false;
    } else {
      return true;
    };

  } catch (error) {
    console.error('Error validating user input for blanks:', error)
  };
};

// define function for adding new items
function addItem(event) {

  try {
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
      updateEventListeners();

      // save the list to local storage
      saveGroceryList();
    };

  } catch (error) {
    console.error('Error adding item:', error);
  }
};

// define Delete function for delete button
function deleteItem(event) {

  try {
    // target the li element that the button is a child of
    let li = event.currentTarget.parentElement;
    li.remove();

    // save the list to local storage
    saveGroceryList();

  } catch (error) {
    console.error('Error deleting item:', error);
  }
}

// define Tick function for items that have been fulfilled
function tickItem(event) {

  try {
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

    // save the list to local storage
    saveGroceryList();

  } catch (error) {
    console.error('Error ticking-off item:', error);
  }
};

// define function for adding a new category
function addCategory(event) {

  try {
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
    <div class="add-category-area" id="${userInput}-area">
      <input type="text" name="category" class="add-category" placeholder="Add new category">
      <button class="add-category-btn"><i class="fa-solid fa-basket-shopping"></i><i class="fa-solid fa-plus smaller-btn" id="smaller-btn"></i></button>
    </div>
    <section class="category-area">
      <h2 class="category-heading"><button class="toggle-list-btn category-btn"><i class="fa-solid fa-caret-down"></i></button> ${userInput} 
        <button class="dlt-category-btn category-btn"><i class="fa-regular fa-trash-can"></i></button>
      </h2>
      <ul class="shop-list"></ul>
      <div class="add-item-area">
        <input type="text" name="item" class="add-item" placeholder="Add grocery item">
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

      // save the list to local storage
      saveGroceryList();
    };

  } catch (error) {
    console.error('Error adding category:', error);
  };
};

// Define function for toggling category list visibility
function toggleList(event) {

  try {
    // get category list to target and the add-item area
    let listArea = event.currentTarget.parentElement.nextElementSibling;
    let addItemArea = listArea.nextElementSibling;

    // show or hide the div based on the current state of the display style
    listArea.style.display = listArea.style.display === 'none' ? 'block' : 'none';
    addItemArea.style.display = addItemArea.style.display === 'none' ? 'block' : 'none';

  } catch (error) {
    console.error('Error toggling list:', error);
  };
};

// define Delete category function
function deleteCategory(event) {

  try {
    // target the category area and the addCategory area preceding it
    let catArea = event.currentTarget.parentElement.parentElement;
    let newCatAreaAbove = catArea.previousElementSibling;
    newCatAreaAbove.remove();
    catArea.remove();

    // save the list to local storage
    saveGroceryList();

  } catch (error) {
    console.error('Error deleting category:', error);
  };
};

// define a function to handle keyboard events
function handleKeyEvents(event) {

  try {
    // if enter key was pressed down
    if (event.key === "Enter" && this.className === "add-category") {
      // run addcategory function
      addCategory(event);
    } else if (event.key === "Enter" && this.className === "add-item") {
      // run additem function
      addItem(event);
    };

  } catch (error) {
    console.error('Error handling "Enter" key event:', error)
  };
};

// define reusable function for updating event listeners when new buttons are added
function updateEventListeners() {

  try {
    // get the latest array of buttons
    let buttons = document.getElementsByTagName('button');

    // add event listeners for buttons based on class
    for (let button of buttons) {
      switch (true) {

        // add event listener for adding list item
        case button.classList.contains("add-item-btn"):
          button.addEventListener("click", addItem);
          break;

          // add event listener for deleting list item
        case button.classList.contains("dlt-item-btn"):
          button.addEventListener("click", deleteItem);
          break;

          // add event listener for ticking list item
        case button.classList.contains("tick-item-btn"):
          button.addEventListener("click", tickItem);
          break;

          // add event listener for showing/hiding list
        case button.classList.contains("toggle-list-btn"):
          button.addEventListener("click", toggleList);
          break;

          // add event listener for adding category
        case button.classList.contains("add-category-btn"):
          button.addEventListener("click", addCategory);
          break;

          // add event listener for deleting category
        case button.classList.contains("dlt-category-btn"):
          button.addEventListener("click", deleteCategory);
          break;

          // default case if none of the above
        default:
          break;
      }
    };

    // get the latest array of input boxes
    let inputBoxes = document.getElementsByTagName('input');

    // add enter keydown event listeners to input boxes
    for (let input of inputBoxes) {
      input.addEventListener("keypress", handleKeyEvents);
    };

  } catch (error) {
    console.error('Error adding event listeners:', error)
  };
};