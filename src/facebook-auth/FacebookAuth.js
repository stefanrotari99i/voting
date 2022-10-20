import React, { useEffect } from 'react'
import './FacebookAuth.css'
import { FacebookAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from "firebase/auth";
import {FaFacebookF} from 'react-icons/fa'

const auth = getAuth();

export const FacebookAuth = () => {
    
    const provider = new FacebookAuthProvider();

    // checl if is mobile or desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleFacebookLogin = () => {
        isMobile ? signInWithRedirect(auth, provider) : signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            // The signed-in user info.
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            // ...
        });
    }


    return (
        <div className='facebook-auth'>
            <div className='facebook-auth__container'>
                <div className='facebook-auth__title'>Logheaza-te cu Facebook</div>
                <div className='facebook-auth__subtitle'>Conectați-vă cu Facebook pentru a vota</div>
                <div onClick={handleFacebookLogin} className='facebook-auth__button'><FaFacebookF /> Logheaza-te cu Facebook</div>
            </div>
        </div>
    )
}