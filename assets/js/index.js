import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

/**
 * Event listener for the Sign In button.
 * Captures email and password input values and calls signInUser function.
 */
document.getElementById("sign-in-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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

/**
 * Event listener for the Sign Up button.
 * Captures email and password input values and calls signUpUser function.
 */
document.getElementById("sign-up-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

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

/**
 * Event listener for the Reset Password button.
 * Captures email input value and calls resetPassword function.
 */
document.getElementById("reset-password-btn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  resetPassword(email);
});

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
