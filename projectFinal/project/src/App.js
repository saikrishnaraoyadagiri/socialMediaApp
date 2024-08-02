import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './Router'; 
import Leftbar from "./Components/Leftbar/Leftbar";
import Header from './Components/Header/Header';

function App() {

  return (
  <BrowserRouter>
      <div className="App">
       {   <> <Leftbar /> 
        <Header/></>}
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
