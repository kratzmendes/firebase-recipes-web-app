import { useState } from 'react';

import FirebaseAuthService from './FirebaseAuthService';

import './App.css';
import LoginForm from './components/LoginForm';


import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebase-config';

const app = initializeApp(getFirebaseConfig());

function App() {

  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title"> Firebase Recipes</h1>
        <LoginForm existingUser={user}></LoginForm>
      </div>
    </div>
  );
}

export default App;
