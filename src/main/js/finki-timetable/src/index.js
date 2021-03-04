import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import TimetableUpload from "./components/TimetableUpload/TimetableUpload";
import StudentTimetable from "./components/StudentTimetable/StudentTimetable";

ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path="/"  component={HomePage}/>
            <Route exact path="/timetable/upload" component={TimetableUpload} />
            <Route exact path="/timetable/:studentId" component={StudentTimetable} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
        </Switch>
    </Router>,
  document.getElementById('root')
);


