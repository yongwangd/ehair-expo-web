const { env } = require("../../project.config");
const firebase = require("firebase");

console.log("connection to firebase with env", env);

// Initialize Firebase
let config = {
  apiKey: "AIzaSyC-iww3k0ANDvHXFJmRJYWNlLVpwlubeXE",
  authDomain: "miao-inventory.firebaseapp.com",
  databaseURL: "https://miao-inventory.firebaseio.com",
  projectId: "miao-inventory",
  storageBucket: "miao-inventory.appspot.com",
  messagingSenderId: "347920015620"
};

if (env == "production") {
  config = {
    apiKey: "AIzaSyC-iww3k0ANDvHXFJmRJYWNlLVpwlubeXE",
    authDomain: "miao-inventory.firebaseapp.com",
    databaseURL: "https://miao-inventory.firebaseio.com",
    projectId: "miao-inventory",
    storageBucket: "miao-inventory.appspot.com",
    messagingSenderId: "347920015620"
  };
}

firebase.initializeApp(config);

export const signinWithFirebase = (username, password) =>
  firebase.auth().signInWithEmailAndPassword(username, password);
export const signoutWithFirebase = () => firebase.auth().signOut();
export const getFirebase = () => firebase;
export const getFireStorage = () => firebase.storage();
export const getFireStorageRef = () => firebase.storage().ref();
export const getBusinessCardRef = () =>
  firebase
    .storage()
    .ref()
    .child("businessCards");
export const getFireDB = () => firebase.database();
