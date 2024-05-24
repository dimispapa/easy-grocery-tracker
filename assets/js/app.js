import {
  db,
  ref,
  set,
  get,
  child,
  update,
  remove,
  onValue
} from "./firebase";

// ****** FUNCTIONS FOR SAVING/LOADING USER DATA AND RECREATING THE DOM AS THE USER LEFT IT ******

/**
 * Initializes the application.
 * Loads the grocery list and sets up event listeners.
 */
document.addEventListener('DOMContentLoaded', function () {

  try {
    // load the grocery list when the page is loaded
    loadGroceryList();

    // update the event listeners for key functionality
    updateEventListeners();

  } catch (error) {
    console.error('Error during initialization:', error);
  };
});

/**
 * Saves data to local storage.
 * @param {string} key - The key under which the data is stored.
 * @param {Array} data - The data to be stored.
 */
function saveDataToLocalStorage(key, data) {

  try {
    localStorage.setItem(key, JSON.stringify(data));

  } catch (error) {
    console.error('Error saving to local storage:', error);
  };
};

/**
 * Saves the grocery list data to Firebase.
 * @param {Array} groceryList - The grocery list to save.
 */
function saveDataToFirebase(groceryList) {

  const dbRef = ref(database, 'groceryList');
  set(dbRef, groceryList)
    // add error handling
    .then(function () {
      console.log('Grocery list successfully saved on firebase.');
    })
    .catch(function (error) {
      console.error('Error saving grocery list:', error)
    })
}

/**
 * Loads the grocery list data from Firebase by listening to changes to data.
 * @param {string} dataPath - The path under which the data is stored.
 * @returns {any} - The loaded data or null if not found.
 */
function loadDataFromFirebase(dataPath) {

  const dbRef = ref(database, dataPath);
  // set up event listener to read static snapshots on data path
  onValue(dbRef, (snapshot) => {

      // retrieve data in the snapshot if exists
      if (snapshot.exists()) {
        const DATA = snapshot.val();
        return DATA;
      } else {
        console.log('No data available on firebase.');
        return;
      };

    })
    // add error handling
    .catch(function (error) {
      console.error('Error loading data from firebase', error);
    })
};

/**
 * Loads data from local storage.
 * @param {string} key - The key under which the data is stored.
 * @returns {any} - The loaded data or null if not found.
 */
function loadDataFromLocalStorage(key) {

  try {
    // get data item from local storage
    const LOCALDATA = localStorage.getItem(key);

    // return data parse from json if it exists otherwise return null
    return LOCALDATA ? JSON.parse(LOCALDATA) : null;

  } catch (error) {
    console.error('Error loading from local storage:', error);
    return null;
  };
};

/**
 * Saves the grocery list to local storage.
 */
function saveGroceryList() {

  try {
    // parse the category areas into a node list
    const CATEGORIES = document.querySelectorAll('.category-area');
    // create an empty grocery list array to store data
    let groceryList = [];

    // loop through each category area
    for (let category of CATEGORIES) {

      // extract the category heading name
      let categoryName = category.querySelector('.category-name').textContent.trim();
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

    // save the grocery list data to local storage as a backup
    saveDataToLocalStorage('grocery_list', groceryList);

    // save data to firebase
    saveDataToFirebase(groceryList);

  } catch (error) {
    console.error('Error saving grocery list:', error);
  }
};

/**
 * Loads the grocery list from local storage.
 */
function loadGroceryList() {

  // attempt to load data from firebase db
  try {

    const GROCERYLIST = loadDataFromFirebase('groceryList');

    // if data exists, then loop through to populate the list
    if (GROCERYLIST) {

      // loop through the categories in the data
      for (let categoryData of GROCERYLIST) {

        // call the function that populates the DOM with containing the data
        populateListFromData(categoryData.category, categoryData.items);

      };

      console.log('Data loaded from firebase.')

      // if data does not exist on firebase, attempt to load from local storage
    } else {
      const GROCERYLIST = loadDataFromLocalStorage('groceryList');

      // if data does not exist, then return
      if (!GROCERYLIST) {
        console.log('Data not found on firebase or local storage.')
        return;
      }

      // loop through the categories in the data
      for (let categoryData of GROCERYLIST) {

        // call the function that populates the DOM with containing the data
        populateListFromData(categoryData.category, categoryData.items);

      };

    };

  } catch (error) {
    console.error('Error loading grocery list:', error);
  }

};

/**
 * Populates html for a list category and its items from locally stored data.
 * @param {string} categoryName - The name of the category.
 * @param {Array} items - The items in the category.
 */
function populateListFromData(categoryName, items) {

  try {
    // build the html structure using template literal with the category name from the data
    let loadCat = `
    <section class="category-area" id="${categoryName}-area">
      <h2 class="category-heading">
        <button class="toggle-list-btn category-btn"><i class="fa-solid fa-caret-down"></i></button>
        <span class="category-name">${categoryName}</span>
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

// ****** FUNCTIONALITY/OPERATIONAL CODE FOR MANIPULATING THE DOM *******

/**
 * Validates if the input is already exists in the list.
 * @param {string} userInput - The input text from the user.
 * @param {HTMLElement} ulElement - The ul element to check within.
 * @param {HTMLElement} inputBox - The input box element.
 * @returns {boolean} - True if no duplicate i.e. validated, false otherwise.
 */
function validateIfDuplicateItem(userInput, ulElement, inputBox) {

  try {
    // get array of li elements in ul
    let items = ulElement.getElementsByTagName('span');

    // check if ul has at least one li element
    if (items.length !== 0) {

      // loop through li elements to check if new text input exists
      for (let item of items) {

        // check for a case insesitive match
        if (item.textContent.toLowerCase().trim() === userInput.toLowerCase().trim()) {
          // call show error function for the error to appear on page
          showError(inputBox, 'This item already exists in the list!');
          // invalidate input
          return false;
        };
      };
    };
    // default return as true if no duplicate found in loop
    return true;
  } catch (error) {
    console.error('Error validating list item user input for duplicates:', error)
  };
};

/**
 * Validates if the input already exists as a category in the list.
 * @param {string} userInput - The input text from the user.
 * @param {HTMLElement} inputBox - The input box element.
 * @returns {boolean} - True if no duplicate i.e. validated, false otherwise.
 */
function validateIfDuplicateCategory(userInput, inputBox) {

  try {
    // get array of category heading names
    let categoryNames = document.getElementsByClassName('category-name');

    // loop through li elements to check if new text input exists
    for (let categoryName of categoryNames) {

      // check for a case insesitive match
      if (categoryName.textContent.toLowerCase().trim() === userInput.toLowerCase().trim()) {
        // call show error function for the error to appear on page
        showError(inputBox, 'This category already exists in the list!');
        // invalidate the input
        return false;
      };
    };

    // default return as true if no duplicate found in loop
    return true;

  } catch (error) {
    console.error('Error validating category user input for duplicates:', error)
  };
};

/**
 * Validates if the input is blank.
 * @param {string} userInput - The input text from the user.
 * @param {HTMLElement} inputBox - The input box element.
 * @returns {boolean} - True if not blank, false otherwise.
 */
function validateIfBlank(userInput, inputBox) {

  try {
    // if input is empty string/blank
    if (userInput == "") {
      // call show error function for the error to appear on page
      showError(inputBox, "Please fill out the text box!")
      // return false to invalidate
      return false;
    }
    // return true to validate
    return true;

  } catch (error) {
    console.error('Error validating user input for blanks:', error);
    // return false to invalidate as function did not operate as expected
    return false;
  };
};

/**
 * Shows an error message for an input box entry.
 * @param {HTMLElement} inputBox - The input box element.
 * @param {string} message - The error message to display.
 */
function showError(inputBox, message) {

  // add the "error" class styles to the input box to highlight
  inputBox.classList.add('error');

  // define the parent and the element that will show the error message
  let parentElement = inputBox.parentElement;
  let errorContainer = parentElement.nextElementSibling;

  // check if the error container is populated or highlighted already
  if (!errorContainer || !errorContainer.classList.contains('error-message')) {
    // create the error container element
    errorContainer = document.createElement('p');
    // add error message class to the container for styles to apply
    errorContainer.classList.add('error-message');
    // insert the error container element after the input box
    parentElement.parentNode.insertBefore(errorContainer, parentElement.nextSibling);
  };

  // write the message in the error container and make visible
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';

};

/**
 * Clears the error message and styles related to an erroneous input box entry.
 * @param {HTMLElement} inputBox - The input box element.
 */
function clearError(inputBox) {

  // remove the error class from the input box to remove highlighting
  inputBox.classList.remove('error');

  // get the error container element and parent
  let parentElement = inputBox.parentElement;
  let errorContainer = parentElement.nextElementSibling;

  // check if the errorContainer exists
  if (errorContainer) {

    // hide the error container
    errorContainer.style.display = 'none';

  };
};

/**
 * Adds a new item to a category on the grocery list.
 * @param {Event} event - The event object.
 */
function addItem(event) {

  try {
    // Get the parent of the btn that triggered the event
    let triggerElement = event.currentTarget;
    let ul = triggerElement.parentElement.previousElementSibling;

    // Get the input box element. Use ternary operator to capture the case where the enter key was used instead of the button
    let inputBox = triggerElement.className === "add-item-btn" ? triggerElement.previousElementSibling : triggerElement;
    // get the user input text and apply trim method to ensure no spaces. 
    let userInput = inputBox.value.trim();

    // Validate input
    if (validateIfBlank(userInput, inputBox) && validateIfDuplicateItem(userInput, ul, inputBox)) {

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

      // clear the error if exists
      clearError(inputBox);

      // update event listeners based on latest DOM
      updateEventListeners();

      // save the list to local storage
      saveGroceryList();
    };

  } catch (error) {
    console.error('Error adding item:', error);
  }
};

/**
 * Deletes a list item from the grocery list.
 * @param {Event} event - The event object.
 */
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

/**
 * Toggles the completion status of an item in the grocery list.
 * @param {Event} event - The event object.
 */
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

/**
 * Adds a new category to the grocery list.
 * @param {Event} event - The event object.
 */
function addCategory(event) {

  try {

    // Get the parent of the btn that triggered the event
    let triggerElement = event.currentTarget;
    let newCatArea = triggerElement.parentElement;

    // Get the input box element. Use ternary operator to capture the case where the enter key was used instead of the button
    let inputBox = triggerElement.className === "add-category-btn" ? triggerElement.previousElementSibling : triggerElement;
    // get the user input text and apply trim method to ensure no spaces
    let userInput = inputBox.value.trim();

    // Validate input
    if (validateIfBlank(userInput, inputBox) && validateIfDuplicateCategory(userInput, inputBox)) {

      // define the HTML for a new category to be added, with areas to add new items/categories
      let newCat = `
      <div class="add-category-area" id="${userInput}-area">
        <input type="text" name="category" class="add-category" placeholder="Add new category">
        <button class="add-category-btn"><i class="fa-solid fa-basket-shopping"></i><i class="fa-solid fa-plus smaller-btn" id="smaller-btn"></i></button>
      </div>
      <section class="category-area">
        <h2 class="category-heading">
          <button class="toggle-list-btn category-btn"><i class="fa-solid fa-caret-down"></i></button>
          <span class="category-name">${userInput}</span>
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

      // clear the error if exists
      clearError(inputBox);

      // update event listeners based on latest DOM
      updateEventListeners()

      // save the list to local storage
      saveGroceryList();
    };

  } catch (error) {
    console.error('Error adding category:', error);
  };
};

/**
 * Toggles the visibility of the item list in a category.
 * @param {Event} event - The event object.
 */
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

/**
 * Deletes a category from the grocery list.
 * @param {Event} event - The event object.
 */
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

/**
 * Handles key events for input fields.
 * @param {Event} event - The event object.
 */
function handleKeyEvents(event) {

  try {
    // if enter key was pressed down
    if (event.key === "Enter" && this.classList.contains("add-category")) {
      // run addcategory function
      addCategory(event);
    } else if (event.key === "Enter" && this.classList.contains("add-item")) {
      // run additem function
      addItem(event);
    };

  } catch (error) {
    console.error('Error handling "Enter" key event:', error)
  };
};

/**
 * Updates event listeners for buttons and input fields.
 */
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
      // add an event listener to clear the error when the user loses focus from the input box
      input.addEventListener("focusout", function (event) {
        clearError(event.target);
        // also clear the input box to avoid text lingering
        event.target.value = '';
      });
    };

  } catch (error) {
    console.error('Error adding event listeners:', error)
  };
};