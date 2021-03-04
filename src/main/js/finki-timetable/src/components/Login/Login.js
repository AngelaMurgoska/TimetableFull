import React, {Component} from 'react';
import {Button, Col, Form, Image, Nav, NavbarBrand, Row} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import AuthFinkiTimetableApi from "../../api/authFinkiTimetableApi";
import Menu from "../Menu/Menu";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: '', studentIndex: '', isAuthenticated: false, open: false, loginError: false};
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
                    this.setState({open: true});
                    this.setState({loginError: true, loginUnsuccessfulMessage: "Неуспешна најава, проверете ги внесените податоци."})
                }
            }).catch(err => this.setState({loginError: true, loginUnsuccessfulMessage: "Неуспешна најава, проверете ги внесените податоци."}))
    };

    render() {
        if (this.state.isAuthenticated) {
            return <Redirect to={"/"}/>
        } else {
            return (
                <React.Fragment>
                    <Menu/>
                    <div>
                        <h4 className="text-center pt-5">Најава</h4>
                        <div className="container mt-4">
                            <Row className="justify-content-center align-items-center">
                                <Col md={6}>
                                    <Col md={12}>
                                        {this.state.loginError && <Form.Group className={"text-danger"}>{this.state.loginUnsuccessfulMessage}</Form.Group>}
                                        <Form.Group>
                                            <Form.Control id="email" type="email" name="email"
                                                   onChange={this.handleChange} placeholder="Email"/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Control id="password" type="password" name="password"
                                                   onChange={this.handleChange} placeholder="Password"/>
                                        </Form.Group>
                                        <div className={"text-center"}>
                                        <Button variant="info" type="submit" onClick={this.login}
                                                className="mt-3 mb-4 btn-block">Најава</Button>
                                               <hr/>
                                            <Link to="/register">
                                                <Button variant="success" type="submit" className="mt-3 mb-4 w-75">Регистрирај нов профил</Button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }
}

export default Login;