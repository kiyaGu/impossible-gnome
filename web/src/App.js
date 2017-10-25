import React, { Component } from 'react';
import {Container} from 'reactstrap';
import CenterComp from './Component/CenterComp.js'
import Facebook from './Component/Facebook.js'
import OldUser from './Component/OldUser.js'
// import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <Container>
       <CenterComp />
       <Facebook />
       <OldUser />
      </Container>
    );
  }
}

export default App;
