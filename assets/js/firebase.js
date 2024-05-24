  // initialize firebase
  import {
    initializeApp
  } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'

  // add the Firebase SDK for Google Analytics
  import {
    getAnalytics
  } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js'

  // Add Firebase products
  import {
    getDatabase,
    ref,
    set
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

  // write user data function
  function writeUserData(userId, userName, password, email) {
    // Initialize Realtime Database and get a reference to the service
    const db = getDatabase(app);
    // write user data to the users location on the database
    set(ref(db, 'users/' + userId), {
      username: userName,
      password: password,
      email: email
    });
  }