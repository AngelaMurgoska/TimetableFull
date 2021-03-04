import React, {Component, useState} from 'react'
import {Col, Form, Image, Nav, NavbarBrand, Row} from "react-bootstrap";
import SearchInput from "../SearchField/SearchField";
import StudentRegister from "./StudentRegister/StudentRegister";
import StaffRegister from "./StaffRegister/StaffRegister";
import AuthFinkiTimetableApi from "../../api/authFinkiTimetableApi";
import RegistrationMessage from "./SuccessfulRegistration/RegistrationMessage";
import Menu from "../Menu/Menu";

const Register = () => {

    const roles = [{value: 1, label: "Студент"}, {value: 2, label: "Техничко лице"}]
    const [chosenRole, setChosenRole] = useState('')
    const [successfulRegistration, setSuccessfulRegistration] = useState(false)
    const [registerError, setRegisterError] = useState(false)
    const [registerUnsuccessfulMessage, setRegisterUnsuccessfulMessage] = useState("")

    const handleUserChange = (user) => {
        user ? setChosenRole(user.value) : setChosenRole('')
    }

    const createStaffUser = (staffUserData) => {
        if (staffUserData) {
            staffUserData.userRole = {id: chosenRole}
            AuthFinkiTimetableApi.registerStaffUser(staffUserData).then((response) => {
                setSuccessfulRegistration(true)
            }).catch((error) => {
                setRegisterError(true)
                setRegisterUnsuccessfulMessage(error.response.data)
            })
        }
    }

    const createStudentUser = (studentUserData) => {
        if (studentUserData) {
            AuthFinkiTimetableApi.registerStudentUser(studentUserData).then((response) => {
                setSuccessfulRegistration(true)
            }).catch((error) => {
                setRegisterError(true)
                setRegisterUnsuccessfulMessage(error.response.data)
            })
        }
    }

    return (<React.Fragment>
        <Menu/>
        <div>
            <h4 className="text-center pt-5">Регистрација</h4>
            <div className="container mt-4">
                <Row className="justify-content-center align-items-center">
                    <Col md={6}>
                        <Col md={12}>
                            {registerError && <Form.Group className={"text-danger"}>{registerUnsuccessfulMessage}</Form.Group>}
                            <Form.Group>
                                <SearchInput isClearable={false} onChangeMethod={handleUserChange} searchPlaceholder={"Тип на профил"} searchData={roles}/>
                            </Form.Group>
                            {chosenRole === 1 && <StudentRegister createStudentUser = {createStudentUser}/>}
                            {chosenRole === 2 && <StaffRegister createStaffUser = {createStaffUser}/>}
                        </Col>
                    </Col>
                </Row>
                <Row className={"justify-content-center align-items-center"}>
                    <Col md={6} className={"text-center"}>
                        <small><RegistrationMessage message = {"Веќе имаш профил? "} type = {"link"}/></small>
                        <hr/>
                    </Col>
                </Row>
                <Row className = {"justify-content-center align-items-center"}>
                    {successfulRegistration && <RegistrationMessage message = {"Успешна регистрација! "} type = {"button"}/>}
                </Row>
            </div>
        </div>
    </React.Fragment>)
}

export default Register;