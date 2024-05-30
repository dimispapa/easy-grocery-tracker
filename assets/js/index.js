import {
  auth
} from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Add event listener when DOM content loads
document.addEventListener("DOMContentLoaded", () => {
  // initialize event listeners
  setUpAuthForms();
  setUpToggleButtons();
  setUpEnterKeypress();
});

/**
 * Sets up event listeners for authentication forms.
 */
function setUpAuthForms() {
  // Set up Sign In form submission event listener
  document
    .getElementById("sign-in-form")
    .addEventListener("submit", signInUser);

  // Set up Sign Up form submission event listener
  document
    .getElementById("sign-up-form")
    .addEventListener("submit", signUpUser);

  // Set up Reset Password form submission event listener
  document
    .getElementById("reset-password-form")
    .addEventListener("submit", resetPassword);
}

/**
 * Handles the Sign In form submission.
 * @param {Event} event - The event object.
 */
function signInUser(event) {
  event.preventDefault();
  const email = document.getElementById("sign-in-email").value;
  const password = document.getElementById("sign-in-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in:", user);
      window.location.href = "tracker.html";
    })
    // handle errors
    .catch((error) => {
      // handle invalid credential error
      if (error.code === "auth/invalid-credential") {
        let errorMessage = "Error signing in: Invalid email and/or password.";
        console.error(errorMessage);
        showError(errorMessage);
        // handle all other errors
      } else {
        console.error("Error signing in:", error);
        showError("Error signing in:" + error.message);
      }
    });
}

/**
 * Handles the Sign Up form submission.
 * @param {Event} event - The event object.
 */
function signUpUser(event) {
  // prevent default submission
  event.preventDefault();

  // get from values
  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // check if passwords match and show error
  if (password !== confirmPassword) {
    showError("Error signing up: Passwords do not match!");
    return;
  }

  // call firebase function to create user
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up:", user);
      window.location.href = "tracker.html";
    })
    // handle errors
    .catch((error) => {
      // handle email-already-in-use error
      if (error.code === "auth/email-already-in-use") {
        let errorMessage = "Error signing up: Email is already in use.";
        console.error(errorMessage);
        showError(errorMessage);

        // handle all other errors
      } else {
        console.error("Error signing up:", error);
        showError("Error signing up:" + error.message);
      }
    });
}

/**
 * Handles the Reset Password form submission.
 * @param {Event} event - The event object.
 */
function resetPassword(event) {
  // prevent default submission
  event.preventDefault();
  // get form value
  const email = document.getElementById("reset-email").value;

  // call firebase function for sending reset password email
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent.");
      showError("Password reset email sent. Please check your inbox.");
    })
    // catch if any error.
    // However due to Firebase's email enumeration protection feature, doesn't throw an error if email does not exist.
    .catch((error) => {
      console.error("Error resetting password:", error);
      showError("Error resetting password:" + error.message);
    });
}

/**
 * Sets up the event listeners for the toggle buttons to show/hide forms.
 */
function setUpToggleButtons() {
  document.getElementById("show-sign-in").addEventListener("click", () => {
    toggleFormVisibility("sign-in-form");
  });

  document.getElementById("show-sign-up").addEventListener("click", () => {
    toggleFormVisibility("sign-up-form");
  });

  document
    .getElementById("show-reset-password")
    .addEventListener("click", () => {
      toggleFormVisibility("reset-password-form");
    });
}

/**
 * Toggles the visibility of authentication forms.
 * @param {string} formId - The ID of the form to show.
 */
function toggleFormVisibility(formId) {
  const forms = document.querySelectorAll(".auth-form");
  forms.forEach((form) => (form.style.display = "none"));
  document.getElementById(formId).style.display = "flex";
}

/**
 * Displays an error message below the input fields.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  // get the error container
  const errorMessageElement = document.getElementById("login-error");
  // Remove "Firebase: " from the error message and apply to text content
  errorMessageElement.textContent = message.replace("Firebase: ", "");
  // unhide the error container
  errorMessageElement.style.display = "block";
}

/**
 * Sets up the event listener for the Enter key press to submit the visible form.
 */
function setUpEnterKeypress() {
  window.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const visibleForm = document.querySelector(".auth-form:not(.hidden)");
      if (visibleForm) {
        visibleForm.querySelector("button[type='submit']").click();
      }
    }
  });
}