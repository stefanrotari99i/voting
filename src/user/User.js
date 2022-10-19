import React, {useState, useEffect} from 'react'
import './User.css'
import { getDoc, getDocs, setDoc, doc, query, collection, where, updateDoc, arrayUnion, arrayRemove} from "firebase/firestore"; 
import {db} from '../firebase/firebase'
import {BiDownvote, BiUpvote} from 'react-icons/bi'
import {FiExternalLink} from 'react-icons/fi'
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function User({name, image, voteCount, user}) {
    const [vote, setVote] = useState(voteCount)
    const [isVoted, setIsVoted] = useState(false)
    const [isLoaded, setIsLoaded] = useState(true)
    const [isAuth, setIsAuth] = useState(false)
    // make id unique from name
    const id = name.replace(/\s/g, '').toLowerCase()

    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true)
            } else {
                setIsAuth(false)
            }
        });
    }, [])


    // che

    // vote handler
    const voteHandler = () => {
        setIsLoaded(false)
        if (isAuth) {
            if (!isVoted) {  
                setVote(vote + 1)
                setIsVoted(true)
                addVotedUser()
                setIsLoaded(true)
            }
        } else {
            setIsLoaded(true)
            alert('You must be logged in to vote')
        }
    }

    const unvoteHandler = () => {
        setIsLoaded(false)
        if (isAuth) {
            if (isVoted) {
                if(vote > 0) {
                    setVote(vote - 1)
                    setIsVoted(false)
                    removeVotedUser()
                    setIsLoaded(true)
                }
            }
        } else {
            setIsLoaded(true)
            alert('You must be logged in to vote')
        }
    }

    useEffect(() => {
        setIsLoaded(false)
        updateData()
        checkVoted()
        setIsLoaded(true)
    }, [vote])

    // update vote count in firebase
    const updateData = async () => {
        setIsLoaded(false)
        const userRef = doc(db, "users", id);
        await updateDoc(userRef, {
            voteCount: vote
        });
        setIsLoaded(true)

    }

    // if user id exists in voted array, set isVoted to true
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


    useEffect(() => {
        fetchList()
    }, [])

    const fetchList = async () => {
        setIsLoaded(false)
        const userRef = doc(db, "users", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            setIsLoaded(true)
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            setIsLoaded(true)
        }
    }

    const addVotedUser = async () => {
        await updateDoc(doc(db, "users", id), {
            votedUsers: arrayUnion(user)
        })
    }

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
