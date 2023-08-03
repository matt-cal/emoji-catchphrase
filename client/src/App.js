import React, { Component } from 'react';
import './App.css';
import { Link, Router } from "@reach/router"

import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import TestPage from './pages/TestPage';

class App extends Component {

  render() {
    return (
      <>
        <Router>
          <HomePage path="/" exapmle={"example"}/>
          <Chat path="/chat"/>
          <TestPage path="/test"/>
        </Router>
      </>
    );
  }
}

export default App;
