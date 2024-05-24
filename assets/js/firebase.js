// import required SDKs needed
import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'

// Add Firebase products
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js"

// Project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFDjhdHJ3_I2GYxgeJ-EFBlomj3Oxd_xo",
  authDomain: "easy-grocery-tracker.firebaseapp.com",
  projectId: "easy-grocery-tracker",
  storageBucket: "easy-grocery-tracker.appspot.com",
  messagingSenderId: "442203934572",
  appId: "1:442203934572:web:8dcefeebdc8d4b9a09ed49",
  measurementId: "G-XQMGRZ6KG0",
  databaseURL: "https://easy-grocery-tracker-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export {
  db,
  ref,
  set,
  onValue
};