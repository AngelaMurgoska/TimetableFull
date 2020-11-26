import React from 'react';
import logo from "../../logo.png";
import {Image, NavbarBrand, Nav} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import './Menu.css'

const Menu = ({history})=> {

    const loggedin = sessionStorage.getItem("username");
    console.log(loggedin);
    const role = sessionStorage.getItem("role");

    const logOut = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("role");
        history.push('/')
    }


    if (loggedin) {

        if (role === "ROLE_STUDENT") return (
            <Nav className={"navbar fixed-top navbar-light bg-light"}>
                <NavbarBrand>
                    <Image src={logo} fluid/>
                    <span className={"ml-2"}><a className={"text-decoration-none"}
                                                href={"/"}>Распоред на часови</a></span>
                </NavbarBrand>
                <Nav.Item>
                    <span className={"ml-2"}><a className={"menu-link text-decoration-none"} href={"/timetable/"+loggedin}>Мој распоред</a></span>
                     <span onClick={(e) => logOut(e)} className={"ml-4"}>Одјава</span>
                </Nav.Item>
            </Nav>
        )

        else return (
            <Nav className={"navbar fixed-top navbar-light bg-light"}>
                <NavbarBrand>
                    <Image src={logo} fluid/>
                    <span className={"ml-2"}><a className={"text-decoration-none"}
                                                href={"/"}>Распоред на часови</a></span>
                </NavbarBrand>
                <Nav.Item >
                    <span className={"ml-4"} onClick={(e) => logOut(e)}>Одјава</span>
                </Nav.Item>
            </Nav>
        )

    } else return (
        <Nav className={"navbar fixed-top navbar-light bg-light"}>
            <NavbarBrand>
                <Image src={logo} fluid/>
                <span className={"ml-2"}><a className={"text-decoration-none"} href={"/"}>Распоред на часови</a></span>
            </NavbarBrand>
            <Nav.Item>
                <span><Link className="menu-link" to="/login">Најава</Link></span>
            </Nav.Item>
        </Nav>
    )
}

export default  withRouter(Menu);