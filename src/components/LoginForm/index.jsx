import { useState } from "react";
import FirebaseAuthService from "../../FirebaseAuthService";


import { initializeApp } from "firebase/app";
import { getFirebaseConfig } from "../../firebase-config";


// Initialize Firebase
const firebaseAppConfig = getFirebaseConfig();

initializeApp(firebaseAppConfig);

function LoginForm ({ existingUser}) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(event){
        event.preventDefault();

        try {
            FirebaseAuthService.logInWithEmailAndPassword(username, password);
            setUsername("");
            setPassword("");

        } catch (error) {
            alert(error.message);
        }

    }

    function handleLogout() {
        FirebaseAuthService.logOut();
    }

    async function handleSendResetPasswordEmail() {
        if (!username){
            alert("Missing username!");
            return;
        }

        try {
            await FirebaseAuthService.sendUserPasswordResetEmail(username);
            
        } catch (error) {
            alert(error.message);            
        }
    }

    async function handleLoginWithGoogle() {
        try {
            await FirebaseAuthService.logInWithGoogle();
        } catch (error) {
            alert(error.message);            
        }
    }


    return (
        <div className="login-form-container">
            {
                existingUser ? 
                    (
                    <div className="row">
                        <h3>Welcome, {existingUser.email}</h3>
                        <button type="button" className="primary-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    ) : (

                    <form onSubmit={handleSubmit} className="login-form">

                        <label className="input-label login-label">
                            Username (email):
                            <input
                                type="email"
                                required
                                value={username}
                                onChange={ (event) => setUsername(event.target.value)}
                                className="input-text"
                            
                            />
                        </label>

                        <label className="input-label login-label">
                            Password:
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={ (event) => setPassword(event.target.value)}
                                className="input-text"
                            
                            />
                        </label>

                        <div className="button-box">
                            
                            <button className="primary-button">
                                Login
                            </button>

                            <button type="button" onClick={handleSendResetPasswordEmail} className="primary-button">
                                Reset Password
                            </button>
                            
                            <button type="button" onClick={handleLoginWithGoogle} className="primary-button">
                               Login with Google
                            </button>

                        </div>

                    </form>
                    )
            }

        </div>
    )
    
}

export default LoginForm