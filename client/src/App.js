import React, { Component } from 'react';
import './App.css';
import { Link, Router } from "@reach/router"

import HomePage from './pages/HomePage';
import Chat from './pages/Chat';
import TestPage from './pages/TestPage';

class App extends Component {
state = {
    data: null
  };

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));
  }
    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };


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
