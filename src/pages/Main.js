import '../App.css';
import User from '../user/User';
import { getDocs, query, collection, orderBy, onSnapshot} from "firebase/firestore"; 
import {db} from '../firebase/firebase'
import React, {useState, useEffect} from 'react'
import { FacebookAuth } from '../facebook-auth/FacebookAuth';
import {FiLogOut} from 'react-icons/fi'
import {RiTimerLine} from 'react-icons/ri'
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import {FaFacebookSquare} from 'react-icons/fa'
import {AiFillInstagram} from 'react-icons/ai'

export const Main = () => {
    const [users, setUsers] = useState([])
    const [userVote, setUserVote] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isAuth, setIsAuth] = useState(false)
  
    const getUsers = async () => {
      setIsLoaded(false)
      const q = query(collection(db, "users"), orderBy("voteCount", "desc"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUsers((users) => [...users, doc.data()])
        setIsLoaded(true)
      });
    }

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true)
        setUserVote(user)
      } else {
        setIsAuth(false)
      }
    });
  
    // sign out
    const handleSignOut = () => {
      signOut(auth).then(() => {
        setIsAuth(false)
      }).catch((error) => {
        // An error happened.
      });
    }
  
    useEffect(() => {
        getUsers()
    }, [])
  
    // remove duplicates
    const uniqueUsers = [...new Set(users.map(user => user.name))]
    .map(name => {
      return users.find(user => user.name === name)
    })


    // clockdown
  
    return (
        <div className="App">
            {!isAuth &&
            <FacebookAuth />}
            <header className='header'>
                {isAuth &&
                <div className='header__container'>
                <div className='header__user-info'>
                    <img className='header__image' src={userVote?.photoURL} />
                    <span className='header__name'>{userVote?.reloadUserInfo?.displayName}</span>
                </div>
                <img className='header__logo' src={require('../assets/logo.png')} onClick={handleSignOut} />
                <button onClick={handleSignOut} className='header__button'><FiLogOut style={{fontSize: 18}}/><span>Deconecta??i-v??</span></button>
                </div>}
            </header>
            <h1 className="app__title-main"><span>ERASMUS+ UPET</span> Pa??aport pentru Erasmus</h1>
            <span className='app__subtitle'>Voteaz?? pentru studentul t??u Erasmus+ preferat</span>
            <div className='app__social-wrapper'>
                <ul className='app__social'>
                <li><a href="https://www.facebook.com/erasmus.plus.upet" target="_blank">
                    <FaFacebookSquare style={{fontSize: 30, color: 'white'}}/>
                </a></li> 
                </ul>
            </div>
            <div className='container'>
                {isLoaded ? uniqueUsers.map((user) => (
                <User user={userVote?.uid} post={user?.post} country={user?.country} city={user?.city} name={user?.name} image={user?.image} voteCount={user?.votedUsers} />
                )) : <div class="lds-facebook"><div></div><div></div><div></div></div>}
            </div>
            <footer className='footer'>
                <span className='footer__text'>?? 2022 Erasmus+ UPET</span>
                <div className='footer__links'>
                    <a href='/delete' className='footer__link'>Solicitare de ??tergere a datelor cu caracter personal</a>
                    <a href='/privacy' className='footer__link'>Politica de confiden??ialitate</a>
                </div>
            </footer>
        </div>
    )
}