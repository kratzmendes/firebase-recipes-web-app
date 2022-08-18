/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  apiKey: "AIzaSyA_vKuBR602yWmAFf1u5VOJ0ZdGkmUqqK8",
  authDomain: "fir-recipes-2ee87.firebaseapp.com",
  projectId: "fir-recipes-2ee87",
  storageBucket: "fir-recipes-2ee87.appspot.com",
  messagingSenderId: "93183925076",
  appId: "1:93183925076:web:b3eec14dd1e2c2192946c1",
  measurementId: "G-VZDRJQ587F"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    // eslint-disable-next-line no-useless-concat
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}