import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// Sign In
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

// Sign Up
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
