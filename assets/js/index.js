import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

//
document.addEventListener("DOMContentLoaded", () => {
  // initialize event listeners
  setUpAuthForms();

  setUpToggleButtons();
  // add event listener for enter key to submit signin
  setUpEnterKeypress();
});

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

// Sign-in function
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
    .catch((error) => {
      console.error("Error signing in:", error);
      showError("Error signing in:", error.message);
    });
}

// Sign-up function
function signUpUser(event) {
  event.preventDefault();
  const email = document.getElementById("sign-up-email").value;
  const password = document.getElementById("sign-up-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (password !== confirmPassword) {
    showError("Error signing up:", "Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed up:", user);
      window.location.href = "tracker.html";
    })
    .catch((error) => {
      console.error("Error signing up:", error);
      showError("Error signing up:", error.message);
    });
}

// Reset password function
function resetPassword(event) {
  event.preventDefault();
  const email = document.getElementById("reset-email").value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Password reset email sent.");
      showError("Password reset email sent. Please check your inbox.");
    })
    .catch((error) => {
      console.error("Error resetting password:", error);
      showError("Error resetting password:", error.message);
    });
}

// set up button listeners that show/hide forms
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

// function that toggles between hidden/visible state of forms
function toggleFormVisibility(formId) {
  const forms = document.querySelectorAll(".auth-form");
  forms.forEach((form) => form.classList.add("hidden"));
  document.getElementById(formId).classList.remove("hidden");
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

// Add event listener on the window for the keypress event
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
