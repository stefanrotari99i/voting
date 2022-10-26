import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Main } from './pages/Main';
import {Privacy} from './pages/Privacy'
import {Delete} from './pages/Delete'
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import {Close} from './not/Close'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <Routes>
          <Route exact index element={<Main />} />
          <Route path="*" element={<Main />} />
          <Route exact path="/privacy" element={<Privacy />} />
          <Route exact path="/delete" element={<Delete />} />
      </Routes>
    </Router>
);

