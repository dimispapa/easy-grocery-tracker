// define function for adding new items
function addItem(event) {
  console.log('You clicked the add-item button.')
  console.log(event.id);

  // Get the button that triggered the event
  let button = event.target;
  console.log('Button ID:', button.id);

  // get the input element and user entry
  let input = button.previousElementSibling;
  let userInput = input.value;
  console.log('User entry:', userInput);

  // Get the next sibling element (the ul element)
  let ul = button.nextElementSibling;
  console.log('Next Element:', ul);


  // add li item with user entry text
  let newLi = document.createElement('li');
  newLi.textContent = userInput;
  ul.appendChild(newLi);
  console.log('New list:', ul.innerHTML);

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