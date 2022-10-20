import React, {useState, useEffect} from 'react'
import './User.css'
import { getDoc, getDocs, setDoc, doc, query, collection, where, updateDoc, arrayUnion, arrayRemove, onSnapshot} from "firebase/firestore"; 
import {db} from '../firebase/firebase'
import {BiDownvote, BiUpvote} from 'react-icons/bi'
import {FiExternalLink} from 'react-icons/fi'
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function User({name, image, voteCount, user}) {
    const [vote, setVote] = useState(voteCount.length)
    const [isVoted, setIsVoted] = useState(false)
    const [isLoaded, setIsLoaded] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

    let voteBool = false;


    //* make id unique from name
    const id = name.replace(/\s/g, '').toLowerCase()
    const auth = getAuth();

    //* check if user is logged in
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }
        });
    }, [])


    //* Vote handler
    const voteHandler = () => {
        setIsLoaded(false)
        if (isAuth) {
            if (!isVoted) {
                setIsVoted(true)
                addVotedUser()
                setVote(vote + 1)
                setIsLoaded(true) 
            }
        } else {
            setIsLoaded(true)
            alert('You must be logged in to vote')
        }
    }

    //* Unvote handler
    const unvoteHandler = () => {
        setIsLoaded(false)
        if (isAuth) {
            if (isVoted) {
                if(vote > 0) {
                    setIsVoted(false)
                    removeVotedUser()
                    setVote(vote - 1)
                    setIsLoaded(true)
                } else {
                    setIsLoaded(true)
                    alert('You cannot unvote')
                }
            }
        } else {
            setIsLoaded(true)
            alert('You must be logged in to vote')
        }
    }


    //* update vote count
    useEffect(() => {
        setIsLoaded(false)
        updateData()
        checkVoted()
        setIsLoaded(true)
    }, [vote])

    //* update vote count in firebase
    const updateData = async () => {
        setIsLoaded(false)
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, {
            voteCount: vote
        });
        setIsLoaded(true)
    }

    // * update voted users on change
    onSnapshot(doc(db, "users", id), (doc) => {
        setVote(doc.data().voteCount)
    });

    //* if user id exists in voted array, set isVoted to true
    const checkVoted = async () => {
        setIsLoaded(false)
        const userRef = doc(db, "users", id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const votedArray = userDoc.data().votedUsers
            if (votedArray?.includes(user)) {
                setIsVoted(true)
                setIsLoaded(true) 
            }
        } else {
            console.log('no such document')
            setIsLoaded(true)
            
        }
    }

    //* get count of voted users
    const getVotedCount = async () => {
        setIsLoaded(false)
        const userRef = doc(db, "users", id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const votedArray = userDoc.data().votedUsers
            setIsLoaded(true) 
            return votedArray.length
        } else {
            console.log('no such document')
            setIsLoaded(true)
        }
    }

    // * add user to voted array
    const addVotedUser = async () => {
        await updateDoc(doc(db, "users", id), {
            votedUsers: arrayUnion(user)
        })
    }

    //* remove user from voted array
    const removeVotedUser = async () => {
        await updateDoc(doc(db, "users", id), {
            votedUsers: arrayRemove(user)
        })
    }

    return (
        <>
            {isLoaded ? (
                <div className='user' id={id}>
                    <div className='user__info-wrapper'>
                        <img src={image} alt='user' className='user__img'/>
                        <div className='user__info'>
                            <h2 className='user__name'>{name}</h2>
                            <div className='user__location'>
                                <p className='user__info-text'>Austria</p>
                                <p className='user__info-text'>Viena</p>
                            </div>
                            <p className='user__voting'>Voturi: <span id='count' className='user__voting--number'>{vote}</span></p>
                        </div>
                    </div>
                    <div className='user__additional-wrapper'>
                        <a href='#' className='user__info-link'><FiExternalLink /> Vezi postarea</a>
                    </div>
                    {isVoted ? <button className='user__btn user__btn--unvote' disable={isLoaded ? 'false' : 'true'} onClick={unvoteHandler}><BiDownvote className='btn__icon' /> Retrage votul</button> : <button className='user__btn' disable={isLoaded ? 'false' : 'true'} onClick={voteHandler}><BiUpvote className='btn__icon' /> Voteaza</button>}
                </div>
            ) : ( <div class="lds-facebook"><div></div><div></div><div></div></div> )}
        </>

    )
}
