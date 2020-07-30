import React from "react";
import 'bootswatch/dist/lux/bootstrap.min.css';
import SingleBlog from "./components/SingleBlog"
import "./App.css";
import NavbarComponent from "./components/Navbar";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import About from "./components/About";




function App() {
  return (
    <Router>
      <NavbarComponent />

      <div className="App">

        <Route exact path="/">
          <Homepage />
        </Route>

        <Route path="/blogs/:id">
        <SingleBlog/>
      </Route>

        <Route path="/about">
          <About />
        </Route>

     

      </div>
    </Router>
  );
}

export default App;
