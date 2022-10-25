import './App.css';
import React, {useState, useEffect} from 'react'
import { Main } from './pages/Main';
import {Privacy} from './pages/Privacy'
import {Delete} from './pages/Delete'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { Close } from './not/Close';

function App() {
  return (
    <>
    <Close />
      {/* <Main /> */}
    </>
  );
}

export default App;
