import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Login from "./components/Login/Login";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/"  component={App}/>
            <Route exact path="/timetable/:studentId" component={App} />
            <Route exact path="/login" component={Login}/>
        </Switch>
    </Router>,
  document.getElementById('root')
);


