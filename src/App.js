import React from "react";
import "./App.css";

import HomeComponent from "./components/Home";
import CarComponent from "./components/Car";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/car">
                    <CarComponent />
                </Route>
                <Route path="/">
                    <HomeComponent />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
