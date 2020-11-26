import React, {Component} from 'react';
import {Image, Nav, NavbarBrand} from "react-bootstrap";
import logo from "../../logo.png";
import {Link, Redirect} from "react-router-dom";
import axiosFinkiTimetableRepository from "../../repository/axiosFinkiTimetableRepository";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: '', password: '', isAuthenticated: false, open: false};
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    login = () => {
        const user = {userName: this.state.username, password: this.state.password};
        fetch("http://localhost:8080/" + 'login', {
            method: 'POST',
            body: JSON.stringify(user)
        })
            .then(res => {
                const jwtToken = res.headers.get('Authorization');
                if (jwtToken !== null) {
                    sessionStorage.setItem("jwt", jwtToken);
                    sessionStorage.setItem("username",this.state.username);
                     axiosFinkiTimetableRepository.fetchLoggedInUserRole(this.state.username).then(data=>{
                        sessionStorage.setItem("role", data.data.name);
                        console.log(data.data.name);
                        this.setState({role: data.data.name});
                    })
                    this.setState({isAuthenticated: true});
                }
                else {
                    alert('Неуспешна најава');
                    this.setState({open: true});
                }
            })
            .catch(err => console.error(err))
    };

    render() {
        if (this.state.isAuthenticated === true) {
            return <Redirect to={'/'} />
        }
        else {
            return (
                <React.Fragment>
                    <Nav className={"navbar fixed-top navbar-light bg-light"} >
                        <NavbarBrand>
                        <Image src={logo} fluid />
                        <span><Link to={"/"}>Распоред на часови</Link></span>
                    </NavbarBrand>
                    </Nav>
                    <div id="login">
                        <h4 className="text-center pt-5">Најава</h4>
                        <div className="container mt-4">
                            <div id="login-row" className="row justify-content-center align-items-center">
                                <div id="login-column" className="col-md-6">
                                    <div id="login-box" className="col-md-12">
                                        <div className="form-group">
                                            <label htmlFor={"username"}>Корисничко име</label>
                                            <input  id="username" type="text" name="username" onChange={this.handleChange}  className="form-control" placeholder="username" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor={"password"}>Лозинка</label>
                                            <input id="password" type="password" name="password" onChange={this.handleChange}  className="form-control" placeholder="password" />
                                        </div>
                                        <input type="submit" name="submit" onClick={this.login}  className="btn btn-info btn-md" value="Login"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );}
    }
}

export default Login;