import React, {useState, useEffect} from 'react'
import './User.css'
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot} from "firebase/firestore"; 
import {db} from '../firebase/firebase'
import {BiDownvote, BiUpvote} from 'react-icons/bi'
import {FiExternalLink} from 'react-icons/fi'
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function User({name, image, voteCount, user, post, country, city}) {
    const [vote, setVote] = useState(voteCount)
    const [buttonLoaded, setButtonLoaded] = useState(false)
    const [isVoted, setIsVoted] = useState(false)
    const [isLoaded, setIsLoaded] = useState(true)
    const [isAuth, setIsAuth] = useState(false)

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
        setTimeout(() => {
            setButtonLoaded(true)
        }, 1200)
    }, [])

    //* Vote handler
    const voteHandler = () => {
        try {
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
        } catch (error) {
            console.log(error)
        }

    }

    //* Unvote handler
    const unvoteHandler = () => {
        try {
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
        } catch (error) {
            console.log(error)
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
        try {
            const userRef = doc(db, "users", id);
            await updateDoc(userRef, {
                voteCount: vote
            });
        } catch (error) {
            console.log(error)
        }
    }

    // * update voted users on change
    onSnapshot(doc(db, "users", id), (doc) => {
        if(doc.exists()) {
            if(doc.data().votedUsers.includes(user)) {
                setIsVoted(true)
                setVote(doc.data().voteCount)
            } else {
                setIsVoted(false)
                setVote(doc.data().voteCount)
            }
        } else {
            console.log('No such document!')
        }

    });

    // //* if user id exists in voted array, set isVoted to true
    const checkVoted = async () => {
        setIsLoaded(false)
        try {
            const userRef = doc(db, "users", id);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const votedArray = userDoc.data().votedUsers
                if (votedArray?.includes(user)) {
                    setIsVoted(true)
                    setIsLoaded(true) 
                } else {
                    setIsVoted(false)
                    setIsLoaded(true) 
                }
            } else {
                console.log('no such document')
                setIsLoaded(true) 
            }
        } catch (error) {
            console.log(error)
            setIsLoaded(true)
        }
    }
    

    // * add user to voted array
    const addVotedUser = async () => {
        try {
            await updateDoc(doc(db, "users", id), {
                votedUsers: arrayUnion(user)
            })
        } catch (error) {
            console.log(error)
        }

    }

    //* remove user from voted array
    const removeVotedUser = async () => {
        try {
            await updateDoc(doc(db, "users", id), {
                votedUsers: arrayRemove(user)
            })
        } catch (error) {
            console.log(error)
        }
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
                                <p className='user__info-text'>{country}</p>
                                <p className='user__info-text'>{city}</p>
                            </div>
                            <p className='user__voting'>Voturi: <span id='count' className='user__voting--number'>Se incarca...</span></p>
                        </div>
                    </div>
                    <div className='user__additional-wrapper'>
                        <a href={post} className='user__info-link'><FiExternalLink /> Vezi postarea</a>
                    </div>
                    {isVoted ? 
                    <button 
                        className='user__btn user__btn--unvote' 
                        disabled={buttonLoaded ? false : true} 
                        onClick={unvoteHandler}><BiDownvote className='btn__icon' 
                    /> 
                        {buttonLoaded ? 'Retrage votul' : 'Se incarca...'}
                    </button> 
                    : 
                    <button 
                        className='user__btn'
                        disabled={buttonLoaded ? false : true}
                        onClick={voteHandler}><BiUpvote 
                        className='btn__icon' 
                    />  
                    {buttonLoaded ? 'Voteaza' : 'Se incarca...'}
                    </button>}
                </div>
            ) : ( <div class="lds-facebook"><div></div><div></div><div></div></div> )}
        </>

    )
}
