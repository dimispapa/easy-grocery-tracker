import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

//
document.addEventListener("DOMContentLoaded", () => {
  // add event listener on signup btn to first unhide the confirm password field
  const signUpBtn = document.getElementById("sign-up-btn");
  signUpBtn.addEventListener("click", unhideConfirmPassword);

  // add event listener for signin btn
  setUpSignInBtn();

  // add event listener for reset password btn
  setUpRestPasswordBtn();

  // add event listener for enter key to submit signin
  setUpEnterKeypress();
});

/**
 * Add event listener to unhide
 */
function unhideConfirmPassword() {
  const confirmPassword = document.getElementById("confirm-password");

  // unhide confirm password field and prompt user to confirm password
  confirmPassword.classList.remove("hidden");
  showError("Please confirm password and then click Sign Up.");

  // set up sign up event listener
  setUpSignUpBtn();
}

/**
 * Event listener for the Sign In button.
 * Captures email and password input values and calls signInUser function.
 */
function setUpSignInBtn() {
  // add an event listener for signin submission
  document.getElementById("sign-in-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // call the function of firebase to signin
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Signed in:", user);
        window.location.href = "tracker.html";
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        showError(error.message);
      });
  });
}

/**
 * Event listener for the Sign Up button.
 * Captures email and password input values and calls signUpUser function.
 */
function setUpSignUpBtn() {
  const signUpBtn = document.getElementById("sign-up-btn");
  debugger;
  // remove existing event listener before adding a new one
  signUpBtn.removeEventListener("click", unhideConfirmPassword, false);

  // add a new event listener for signup submission
  signUpBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // check if passwords match
    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    // create new user using firebase auth function
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("Signed up:", user);
        window.location.href = "tracker.html";
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        showError(error.message);
      });
  });
}

/**
 * Event listener for the Reset Password button.
 * Captures email input value and calls resetPassword function.
 */
function setUpRestPasswordBtn() {
  document
    .getElementById("reset-password-btn")
    .addEventListener("click", () => {
      const email = document.getElementById("email").value;
      resetPassword(email);
    });
}

/**
 * Displays an error message below the input fields.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  // get the login-error container
  const errorMessageElement = document.getElementById("login-error");
  // Remove "Firebase: " from the error message
  const cleanedMessage = message.replace("Firebase: ", "");
  // apply the message to the container's text content
  errorMessageElement.textContent = cleanedMessage;
  // unhide the error container
  errorMessageElement.style.display = "block";
}

/**
 * Resets the password for the user.
 * @param {string} email - The email address of the user.
 */
function resetPassword(email) {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent.");
      showError("Password reset email sent. Please check your inbox.");
    })
    .catch((error) => {
      console.error("Error resetting password:", error);
      showError(error.message);
    });
}

// Add event listener on the window for the keypress event
function setUpEnterKeypress() {
  const confirmPassword = document.getElementById("confirm-password");

  // add event listener
  window.addEventListener("keypress", (event) => {
    // Check if the Enter key is pressed and confirm that the signup btn wasn't pressed before
    if (event.key === "Enter" && confirmPassword.classList.contains("hidden")) {
      // Simulate a click on the "sign-in-btn"
      document.getElementById("sign-in-btn").click();
    }
    // check if the enter key was pressed and if the signup btn was pressed
    else if (
      event.key === "Enter" &&
      !confirmPassword.classList.contains("hidden")
    ) {
      // Simulate a click on the "sign-up-btn"
      document.getElementById("sign-up-btn").click();
    }
  });
}
