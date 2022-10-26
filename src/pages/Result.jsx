import React from "react";
import "./Result.css";

function ResultItem() {
  return (
    <div className="result__item">
      <img
        src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=604"
        alt="result"
        className="result__img"
      />
      <div className="result__info">
        <h2 className="result__name">Rotari Stefan</h2>
        <span className="result__vote">Voturi: 22</span>
      </div>
    </div>
  );
}

const Result = (props) => {
  return (
    <div className="container container--result">
        <header className="result__header">
            <h1 className="result__upertitle">ERASMUS+ UPET</h1>
            <h2 className="result__title">Rezultate Pașaport pentru Erasmus</h2>
        </header>
        <div className="result__items">
            <ResultItem />
            <ResultItem />
            <ResultItem />
            <ResultItem />
        </div>
    </div>
  );
};

export default Result;
