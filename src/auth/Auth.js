import React, { useEffect } from 'react'
import './Auth.css'
import { getAuth, RecaptchaVerifier,  signInWithPhoneNumber   } from "firebase/auth";



export const Auth = () => {
    const auth = getAuth();
    auth.languageCode = 'ro';
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [error, setError] = React.useState(null);
    const [codeSent, setCodeSent] = React.useState(false);
    const [phoneError, setPhoneError] = React.useState('');
    const [phoneDisabled, setPhoneDisabled] = React.useState(false);
    const [codeError, setCodeError] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');
    const [response, setResponse] = React.useState(null);
    const [isAuth, setIsAuth] = React.useState(false);

    useEffect(() => {
        
        window.recaptchaVerifier = new RecaptchaVerifier('submit-btn', {
            'size': 'invisible',
            'callback': (response) => {

            },
            'expired-callback': () => {
                console.log('expired');
            }

        }, auth);
    }, [])


    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    }

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
    }


    const handleSendVerificationCode = (e) => {
                            // reset recaptcha
                            window.recaptchaVerifier.render().then(function(widgetId) {
                                window.grecaptcha.reset(widgetId);
                            });
        if(validatePhoneNumber(phoneNumber)){
            setPhoneError('');
            setCodeSent(false);
            e.preventDefault();
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    window.confirmationResult = confirmationResult;
                    setCodeSent(true);
                })
                .catch((error) => {

                    setError(error);
                    
                });
        } else {
            setPhoneError('Enter a valid phone number');
        }
    }

    // validate phone number
    const validatePhoneNumber = (phoneNumber) => {
        if(phoneNumber.length > 10) {
            return true;
        } else {
            setPhoneError('Phone number must be 10 digits');
            return false;
        }
    }

    // validate verification code
    const validateVerificationCode = (verificationCode) => {
        if(verificationCode.length != 6) {
            setCodeError('Invalid verification code');
            return false;
        } else {
            setCodeError('');
            return true;
        }
    }


    const handleVerifyCode = (e) => {
        if(validateVerificationCode(verificationCode)){
            e.preventDefault();
            const code = verificationCode;
            window.confirmationResult.confirm(code).then((result) => {
                setResponse(result);
            }).catch((error) => {
                console.log(error);
            });
        } else {
            setCodeError('Invalid verification code');
        }
    }

    useEffect(() => {
        if(response != null){
            localStorage.setItem('user', JSON.stringify(response.user.accessToken));
            setIsAuth(true);
        }
    }, [response])

    

    return(
        <div className={isAuth ? 'auth__none' : 'auth'}>
            <div className='auth__container'>
                <h2 className='auth__title'>Verficare</h2>
                <div className='auth__phone'>
                    {error && <p className='auth__error'>{error}</p>}
                    <input onChange={(e) => handlePhoneNumberChange(e)} disabled={codeSent} className={phoneError ? 'auth__input-phone auth__input-phone--error' : 'auth__input-phone'} type={'tel'} placeholder='Numarul de telefon'/>
                    {phoneError && <p className='auth__error'>{phoneError}</p>}
                    {codeSent && 
                    <input className={codeError ? 'auth__input-code--error auth__input-code' : 'auth__input-code'} type={'text'} onChange={(e) => handleVerificationCodeChange(e)} placeholder='Codul primit prin SMS'/>}
                    {codeError && <p className='auth__error'>{codeError}</p>}
                    {codeSent ? <button className='auth__submit-btn' id='submit-btn' onClick={(e) => handleVerifyCode(e)} >Autentificare</button> : <button className='auth__submit-btn' id='submit-btn' onClick={(e) => handleSendVerificationCode(e)}>Trimite codul</button>}
                </div>
                <div className='recaptcha-container' id='recaptcha-container'></div>
            </div>
        </div>
    )
}
