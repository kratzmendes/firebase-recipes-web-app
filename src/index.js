
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


//import firebase from "firebase";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// eslint-disable-next-line no-unused-vars
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// eslint-disable-next-line no-unused-vars
import { getFirestore } from "firebase/firestore";
// eslint-disable-next-line no-unused-vars
import { getStorage } from "firebase/storage";
import { getFirebaseConfig } from './firebase-config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase
const firebaseAppConfig = getFirebaseConfig();

const app = initializeApp(firebaseAppConfig);
export default app;

// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


