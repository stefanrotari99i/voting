import React, {useState, useEffect} from "react";
import "./Result.css";
import {query, collection, getDocs, orderBy, onSnapshot} from "firebase/firestore";
import {db} from "../firebase/firebase";



function ResultItem({name, voteCount, image}) {
  return (
    <div className="result__item">
      <img
        src={image}
        alt="result"
        className="result__img"
      />
      <div className="result__info">
        <h2 className="result__name">{name}</h2>
        <p className="result__vote">Voturi: <span>{voteCount}</span></p>
      </div>
    </div>
  );
}

const Result = (props) => {
    const [results, setResults] = useState([]);
    const [isLoaded, setIsLoaded] = useState(true);
    const getUsers = async () => {
        setIsLoaded(false)
        const q = query(collection(db, "users"), orderBy("voteCount", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setResults((users) => [...users, doc.data()])
            setIsLoaded(true)
        });
    }

    useEffect(() => {
        getUsers()
    }, [])




  return (
    <div className="container container--result">
        <header className="result__header">
            <h1 className="result__upertitle">ERASMUS+ UPET</h1>
            <h2 className="result__title">Rezultate Pașaport pentru Erasmus</h2>
        </header>
        <div className="result__items">
            {isLoaded ? results.map((result, index) => (
                <ResultItem
                    key={index}
                    name={result.name}
                    voteCount={result.voteCount}
                    image={result.image}
                />
            )) : <div class="lds-facebook"><div></div><div></div><div></div></div>}
        </div>
    </div>
  );
};

export default Result;
