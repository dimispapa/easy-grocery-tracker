function addItem() {
  console.log('You clicked the add-item button.')
};

// add event listener for click on buttons
let buttons = document.getElementsByTagName('button');
console.log(buttons.length);

for (let button of buttons) {
  if (button.className === "new-item-btn") {
    button.addEventListener("click", addItem)
  }
};