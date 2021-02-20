import React, {Component, useState} from 'react'
import {Image, Nav, NavbarBrand} from "react-bootstrap";
import logo from "../../logo.png";
import {Link} from "react-router-dom";
import SearchInput from "../SearchInput/SearchInput";
import StudentRegister from "./StudentRegister/StudentRegister";
import StaffRegister from "./StaffRegister/StaffRegister";
import AuthFinkiTimetableApi from "../../api/authFinkiTimetableApi";
import SuccessfulRegistration from "./SuccessfulRegistration/SuccessfulRegistration";

const Register = () => {

    const roles = [{value: 1, label: "Студент"}, {value: 2, label: "Техничко лице"}]
    const [chosenRole, setChosenRole] = useState('')
    const [registrationSuccess, setRegistrationSuccess] = useState(false)

    const handleUserChange = (user) => {
        user ? setChosenRole(user.value) : setChosenRole('')
    }

    const createStaffUser = (staffUserData) => {
        if (staffUserData) {
            staffUserData.userRole = {id: chosenRole}
            AuthFinkiTimetableApi.registerStaffUser(staffUserData).then((response) => {
                setRegistrationSuccess(true)
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }

    const createStudentUser = (studentUserData) => {
        if (studentUserData) {
            AuthFinkiTimetableApi.registerStudentUser(studentUserData).then((response) => {
                setRegistrationSuccess(true)
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }

    return (<React.Fragment>
        <Nav className={"navbar fixed-top navbar-light bg-light"}>
            <NavbarBrand>
                <Image src={logo} fluid/>
                <span><Link to={"/"} className={"text-decoration-none"}> Распоред на часови</Link></span>
            </NavbarBrand>
        </Nav>
        <div id="login">
            <h4 className="text-center pt-5">Регистрација</h4>
            <div className="container mt-4">
                <div id="login-row" className="row justify-content-center align-items-center">
                    <div id="login-column" className="col-md-6">
                        <div id="login-box" className="col-md-12">
                            <div className="form-group">
                                <SearchInput isClearable={false} onChangeMethod={handleUserChange} searchPlaceholder={"Тип на профил"} searchData={roles}/>
                            </div>
                            {chosenRole === 1 && <StudentRegister createStudentUser = {createStudentUser}/>}
                            {chosenRole === 2 && <StaffRegister createStaffUser = {createStaffUser}/>}
                        </div>
                    </div>
                </div>
                <div className={"row justify-content-center align-items-center"}>
                    <div className={"col-md-6"}>
                        <hr/>
                    </div>
                </div>
                <div className = {"row justify-content-center align-items-center"}>
                    { registrationSuccess && <SuccessfulRegistration/>}
                </div>
            </div>
        </div>
    </React.Fragment>)
}

export default Register;