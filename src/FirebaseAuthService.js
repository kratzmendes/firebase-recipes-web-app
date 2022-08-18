//import app from ".";

//initializeApp(firebaseAppConfig);



import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
 } from 'firebase/auth';

import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';
//import app from '.';


//const app = 
initializeApp(getFirebaseConfig());

const auth = getAuth();

const registerUser = (email, password) => {  //tornar async?
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}


const logInWithEmailAndPassword = (email, password) => {
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    });
}

async function logInWithGoogle() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new GoogleAuthProvider ();
    await signInWithPopup(auth, provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
}

function logOut() {
    // Sign out of Firebase.
    signOut(auth).then(() => {
        //console.log( "Sign-out successful.")
      }).catch((error) => {
        // An error happened.
      });
}

async function sendUserPasswordResetEmail(email) {

    sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    // ..
    alert("sent the password reset email");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
    // ..
  });
}

function subscribeToAuthChanges(handleAuthChange) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          handleAuthChange(user);
          // ...
        } else {
          // User is signed out
          // ...
          handleAuthChange(user);
        }
      });
}


const FirebaseAuthService = {
    registerUser,
    logInWithEmailAndPassword,
    logInWithGoogle,
    logOut,
    sendUserPasswordResetEmail,
    subscribeToAuthChanges
}

export default FirebaseAuthService;


/*
Enviar um e-mail de verificação a um usuário

https://firebase.google.com/docs/auth/web/manage-users?hl=pt-br#send_a_user_a_verification_email

sendEmailVerification(auth.currentUser)
  .then(() => {
    // Email verification sent!
    // ...
  });
  
*/