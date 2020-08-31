import firebase from '@firebase/app';

/*
  To get your rokens:
  * Open your project in firebase console
  * Select the "gear" icon from the left nav
  * Choose "project settings"
  * Scroll down to "your apps"
  * Add a hosting app or select your hosting app
  * Choose "config" under "Firebase SDK snippet"
  * Replace the object below with the provided "firebaseConfig" object
*/
firebase.initializeApp({
  apiKey: 'AIzaSyCjMz2srT0HjuJRPH2ThhLD7XqLcrYqSQQ',
  authDomain: 'portfolio-138c8.firebaseapp.com',
  databaseURL: 'https://portfolio-138c8.firebaseio.com',
  projectId: 'portfolio-138c8',
  storageBucket: 'portfolio-138c8.appspot.com',
  messagingSenderId: '807153287758',
  appId: '1:807153287758:web:a4b9fca89e60a6d2b7b91f',
});

export const FirebaseService = firebase;
