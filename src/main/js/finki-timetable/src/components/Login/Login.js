import React, {Component} from 'react';
import {Image, Nav, NavbarBrand} from "react-bootstrap";
import logo from "../../logo.png";
import {Link, Redirect} from "react-router-dom";
import axiosFinkiTimetableRepository from "../../api/generalFinkiTimetableApi";
import { withRouter } from 'react-router-dom';
import AuthFinkiTimetableApi from "../../api/authFinkiTimetableApi";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', studentIndex: '', isAuthenticated: false, open: false};
    }

    handleChange = (event) => {
        this.setState({[event.target.name] : event.target.value});
    }

    login = () => {
        const user = {userName: this.state.email, password: this.state.password};
        AuthFinkiTimetableApi.loginUser(user)
            .then(res => {
                const jwtToken = res.headers.authorization;
                if (jwtToken !== null) {
                    sessionStorage.setItem("jwt", jwtToken);
                    AuthFinkiTimetableApi.fetchLoggedInUserInfo(this.state.email).then(response => {
                        this.setState({studentIndex: response.data.studentindex})
                        sessionStorage.setItem("username",this.state.studentIndex);
                        AuthFinkiTimetableApi.fetchLoggedInUserRole(this.state.email).then(data=>{
                            sessionStorage.setItem("role", data.data.name);
                            this.setState({role: data.data.name});
                            this.setState({isAuthenticated: true})
                        }).catch((error) => {
                            console.log("User role error" + error.response)
                        });
                    }).catch((error) => {
                        console.log("Login info error" + error.response)
                    })

                }
                else {
                    console.log("neuspesno")
                    this.setState({open: true});
                }
            }).catch(err => console.log(err.response.data.message))
    };

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to={"/"}/>
        } else {
            return (
                <React.Fragment>
                    <Nav className={"navbar fixed-top navbar-light bg-light"}>
                        <NavbarBrand>
                            <Image src={logo} fluid/>
                            <span><Link to={"/"} className={"text-decoration-none"}> Распоред на часови</Link></span>
                        </NavbarBrand>
                    </Nav>
                    <div id="login">
                        <h4 className="text-center pt-5">Најава</h4>
                        <div className="container mt-4">
                            <div id="login-row" className="row justify-content-center align-items-center">
                                <div id="login-column" className="col-md-6">
                                    <div id="login-box" className="col-md-12">
                                        <div className="form-group">
                                            <input id="email" type="text" name="email"
                                                   onChange={this.handleChange} className="form-control"
                                                   placeholder="Email"/>
                                        </div>
                                        <div className="form-group">
                                            <input id="password" type="password" name="password"
                                                   onChange={this.handleChange} className="form-control"
                                                   placeholder="Password"/>
                                        </div>
                                        <div className={"text-center"}>
                                        <input type="submit" name="submit" onClick={this.login}
                                               className="btn btn-info mt-3 mb-4 btn-block" value="Најава"/>
                                               <hr/>
                                            <Link to="/register">
                                                <input type="submit" className="btn btn-success mt-3 mb-4 w-75" value="Регистрирај нов профил"/>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Login;