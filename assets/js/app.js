import { db, auth } from "./firebase.js";

import {
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";

import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// ****** FUNCTIONS FOR SAVING/LOADING USER DATA AND RECREATING THE DOM AS THE USER LEFT IT ******
/**
 * Initializes the application.
 * Sets up the real-time listener and updates event listeners.
 */
document.addEventListener("DOMContentLoaded", function () {
  try {
    // Check user authentication status
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        // Load grocery list for the authenticated user
        setupRealtimeListener(user.uid);
        // unhide app area and sign-out button
        document.getElementById("app-area").classList.remove("hidden");
        document.getElementById("sign-out-btn").classList.remove("hidden");
      } else {
        console.log("No user is signed in.");
        window.location.href = "index.html";
      }
    });
    // Update event listeners for key functionality
    updateEventListeners();
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

/**
 * Loads data from Firebase initially and then loads again every time a change is detected.
 * @param {userId} - the unique user identifier of the current user
 */
function setupRealtimeListener(userId) {
  // get reference to database and user list
  const dbRef = ref(db, `groceryLists/${userId}`);
  // implement onValue listener for changes to db
  onValue(
    dbRef,
    (snapshot) => {
      // evaluate snapshot data
      const data = snapshot.val();
      // check if data exists
      if (data) {
        console.log("Data loaded from firebase db:", data);
        // populate data on the DOM
        populateGroceryList(data);
      } else {
        console.log("No data available on firebase.");
      }
    },
    (error) => {
      console.error("Error loading data from firebase:", error);
    }
  );
}

/**
 * Populates the grocery list from Firebase data.
 * @param {Array} data - The data to populate the list with.
 */
function populateGroceryList(data) {
  // clear the DOM from items/categories first
  clearGroceryList();
  // loop through the categories in the data
  for (let categoryData of data) {
    // populate the list from the categorical data
    populateListFromData(categoryData.category, categoryData.items);
  }
  console.log("List populated.");
}

/**
 * Saves the grocery list data to Firebase.
 * @param {Array} groceryList - The grocery list to save.
 * @param {userId} - the unique user identifier of the current user
 */
function saveDataToFirebase(groceryList, userId) {
  // get reference to the database path
  const dbRef = ref(db, `groceryLists/${userId}`);
  try {
    // write the data to the db
    set(dbRef, groceryList);
    console.log("Grocery list successfully saved on firebase.");
  } catch {
    console.error("Error saving grocery list:", error);
  }
}

/**
 * Clears the grocery list from the DOM.
 */
function clearGroceryList() {
  const mainAppArea = document.getElementById("app-area");

  // clear all children of app area except the permament category area.
  while (mainAppArea.lastChild.id !== "permanent-category-area") {
    mainAppArea.removeChild(mainAppArea.lastChild);
  }
}

/**
 * Saves the grocery list to local storage.
 */
function saveGroceryList() {
  try {
    // get authenticated user
    const user = auth.currentUser;
    if (user) {
      // parse the category areas into a node list
      const categories = document.querySelectorAll(".category-area");
      // create an empty grocery list array to store data
      let groceryList = [];

      // loop through each category area
      for (let category of categories) {
        // extract the category heading name
        let categoryName = category
          .querySelector(".category-name")
          .textContent.trim();
        // create an empty items array to store data
        let items = [];

        // get the list items from the DOM
        const listItems = category.querySelectorAll("li");

        // loop through each list item
        for (let li of listItems) {
          // extract the item name from the span child
          let itemName = li.querySelector("span").textContent.trim();

          // get the state of the item if it is ticked-off or not
          let isTicked = li
            .querySelector("span")
            .classList.contains("ticked-off");

          // store the item object in the items array
          items.push({
            item_name: itemName,
            ticked: isTicked,
          });
        }

        // store the category object with the nested items array, in the overarching grocery list array
        groceryList.push({
          category: categoryName,
          items: items,
        });
      }

      // save data to firebase
      saveDataToFirebase(groceryList, user.uid);
    }
  } catch (error) {
    console.error("Error saving grocery list:", error);
  }
}

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
    let mainAppArea = document.getElementById("app-area");
    mainAppArea.insertAdjacentHTML("beforeend", loadCat);

    // check if there are any items
    if (items != null) {
      // get the ul element by referring to the last child (newly inserted category area) of the app area
      let ul = document
        .getElementById(`${categoryName}-area`)
        .querySelector("ul");

      // loop through items in the data and insert html li elements in the ul
      for (let item of items) {
        // define li element using item variable names and ticked-off status
        // use a ternary operator within the template literal to conditionally set the ticked-off class
        let loadLi = `
        <li>
          <button class="tick-item-btn li-btn"><i class="${
            item.ticked
              ? "fa-regular fa-circle-check ticked-shadow"
              : "fa-regular fa-circle"
          }"></i></button>
          <span class="${item.ticked ? "ticked-off" : ""}">${
          item.item_name
        }</span>
          <button class="dlt-item-btn li-btn"><i class="fa-regular fa-trash-can"></i></button>
        </li> 
        `;

        // insert the li element in the ul list
        ul.insertAdjacentHTML("beforeend", loadLi);
      }
    }
    // update the event listeners on the new updated DOM
    updateEventListeners();
  } catch (error) {
    console.error("Error populating lists from local data:", error);
  }
}

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
    let items = ulElement.getElementsByTagName("span");

    // check if ul has at least one li element
    if (items.length !== 0) {
      // loop through li elements to check if new text input exists
      for (let item of items) {
        // check for a case insesitive match
        if (
          item.textContent.toLowerCase().trim() ===
          userInput.toLowerCase().trim()
        ) {
          // call show error function for the error to appear on page
          showError(inputBox, "This item already exists in the list!");
          // invalidate input
          return false;
        }
      }
    }
    // default return as true if no duplicate found in loop
    return true;
  } catch (error) {
    console.error(
      "Error validating list item user input for duplicates:",
      error
    );
  }
}

/**
 * Validates if the input already exists as a category in the list.
 * @param {string} userInput - The input text from the user.
 * @param {HTMLElement} inputBox - The input box element.
 * @returns {boolean} - True if no duplicate i.e. validated, false otherwise.
 */
function validateIfDuplicateCategory(userInput, inputBox) {
  try {
    // get array of category heading names
    let categoryNames = document.getElementsByClassName("category-name");

    // loop through li elements to check if new text input exists
    for (let categoryName of categoryNames) {
      // check for a case insesitive match
      if (
        categoryName.textContent.toLowerCase().trim() ===
        userInput.toLowerCase().trim()
      ) {
        // call show error function for the error to appear on page
        showError(inputBox, "This category already exists in the list!");
        // invalidate the input
        return false;
      }
    }

    // default return as true if no duplicate found in loop
    return true;
  } catch (error) {
    console.error(
      "Error validating category user input for duplicates:",
      error
    );
  }
}

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
      showError(inputBox, "Please fill out the text box!");
      // return false to invalidate
      return false;
    }
    // return true to validate
    return true;
  } catch (error) {
    console.error("Error validating user input for blanks:", error);
    // return false to invalidate as function did not operate as expected
    return false;
  }
}

/**
 * Shows an error message for an input box entry.
 * @param {HTMLElement} inputBox - The input box element.
 * @param {string} message - The error message to display.
 */
function showError(inputBox, message) {
  // add the "error" class styles to the input box to highlight
  inputBox.classList.add("error");

  // define the parent and the element that will show the error message
  let parentElement = inputBox.parentElement;
  let errorContainer = parentElement.nextElementSibling;

  // check if the error container is populated or highlighted already
  if (!errorContainer || !errorContainer.classList.contains("error-message")) {
    // create the error container element
    errorContainer = document.createElement("p");
    // add error message class to the container for styles to apply
    errorContainer.classList.add("error-message");
    // insert the error container element after the input box
    parentElement.parentNode.insertBefore(
      errorContainer,
      parentElement.nextSibling
    );
  }

  // write the message in the error container and make visible
  errorContainer.textContent = message;
  errorContainer.style.display = "block";
}

/**
 * Clears the error message and styles related to an erroneous input box entry.
 * @param {HTMLElement} inputBox - The input box element.
 */
function clearError(event) {
  // remove the error class from the input box to remove highlighting
  let inputBox =  event.currentTarget.parentElement.querySelector('input')
  inputBox.classList.remove("error");

  // get next sibling of the add-category-area
  let errorContainer = inputBox.parentElement.nextElementSibling;

  // check if an element exists and if it is the errorContainer (to avoid hiding the next category-area)
  if (errorContainer?.classList.contains("error-message")) {
    // hide the error container
    errorContainer.style.display = "none";
  }
}

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
    let inputBox =
      triggerElement.className === "add-item-btn"
        ? triggerElement.previousElementSibling
        : triggerElement;
    // get the user input text and apply trim method to ensure no spaces.
    let userInput = inputBox.value.trim();

    // Validate input
    if (
      validateIfBlank(userInput, inputBox) &&
      validateIfDuplicateItem(userInput, ul, inputBox)
    ) {
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
      ul.insertAdjacentHTML("beforeend", newLi);

      // clear the input box
      inputBox.value = "";

      // clear the error if exists
      clearError(inputBox);

      // update event listeners based on latest DOM
      updateEventListeners();

      // save the list to local storage
      saveGroceryList();
    }
  } catch (error) {
    console.error("Error adding item:", error);
  }
}

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
    console.error("Error deleting item:", error);
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
    span.classList.toggle("ticked-off");

    // target icon of the tick button
    let icon = event.currentTarget.getElementsByTagName("i")[0];

    // togglee icon with checked circle or unchecked circle
    icon.classList.toggle("fa-circle-check");
    icon.classList.toggle("ticked-shadow");
    icon.classList.toggle("fa-circle");

    // save the list to local storage
    saveGroceryList();
  } catch (error) {
    console.error("Error ticking-off item:", error);
  }
}

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
    let inputBox =
      triggerElement.className === "add-category-btn"
        ? triggerElement.previousElementSibling
        : triggerElement;
    // get the user input text and apply trim method to ensure no spaces
    let userInput = inputBox.value.trim();

    // Validate input
    if (
      validateIfBlank(userInput, inputBox) &&
      validateIfDuplicateCategory(userInput, inputBox)
    ) {
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
      newCatArea.insertAdjacentHTML("beforebegin", newCat);

      // clear the input box
      inputBox.value = "";

      // clear the error if exists
      clearError(inputBox);

      // update event listeners based on latest DOM
      updateEventListeners();

      // save the list data
      saveGroceryList();
    }
  } catch (error) {
    console.error("Error adding category:", error);
  }
}

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
    listArea.style.display =
      listArea.style.display === "none" ? "block" : "none";
    addItemArea.style.display =
      addItemArea.style.display === "none" ? "block" : "none";
  } catch (error) {
    console.error("Error toggling list:", error);
  }
}

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

    // save the list
    saveGroceryList();
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

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
    }
  } catch (error) {
    console.error('Error handling "Enter" key event:', error);
  }
}

/**
 * Updates event listeners for buttons and input fields.
 */
function updateEventListeners() {
  try {
    // get the latest array of buttons
    let buttons = document.getElementsByTagName("button");

    // add event listeners for buttons based on class
    for (let button of buttons) {
      switch (true) {
        // add event listener for adding list item
        case button.classList.contains("add-item-btn"):
          button.addEventListener("click", addItem);
          // also clear the relevant input box from any error msg when focus moves out of the button
          button.addEventListener("focusout", clearError);
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
          // also clear the relevant input box from any error msg when focus moves out of the button
          button.addEventListener("focusout", clearError);
          break;

        // add event listener for deleting category
        case button.classList.contains("dlt-category-btn"):
          button.addEventListener("click", deleteCategory);
          break;

        // default case if none of the above
        default:
          break;
      }
    }

    // get the latest array of input boxes
    let inputBoxes = document.getElementsByTagName("input");

    // loop through the array of input boxes
    for (let input of inputBoxes) {
      // add enter keypress event listeners to input boxes
      input.addEventListener("keypress", handleKeyEvents);
      // add an event listener to clear the error when the user loses focus from the input box
      if (!input.hasAttribute("data-has-focus-out-listener")) {
        input.setAttribute("data-has-focus-out-listener", "true");
        input.addEventListener("focusout", function (event) {
          clearError(event);
        });
      }
    }
  } catch (error) {
    console.error("Error adding event listeners:", error);
  }
}

// Add click event listener for Sign out button
document.getElementById("sign-out-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out.");
      // redirect to the index page after sign out
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});
