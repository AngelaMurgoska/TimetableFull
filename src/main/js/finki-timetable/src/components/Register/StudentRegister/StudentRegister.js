import React, {useState} from 'react'
import {Col, Form, Row} from "react-bootstrap";

const StudentRegister = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [studentIndex, setStudentIndex] = useState('')

    const handleEmailChange = (email) => {
        email.target.value ? setEmail(email.target.value) : setEmail('')
    }

    //TODO add another field to validate password if you have the time
    const handlePasswordChange = (password) => {
        password.target.value ? setPassword(password.target.value) : setPassword('')
    }

    const handleNameChange = (name) => {
        name.target.value ? setName(name.target.value) : setName('')
    }

    const handleSurnameChange = (surname) => {
        surname.target.value ? setSurname(surname.target.value) : setSurname('')
    }

    const handleStudentIndexChange = (studentIndex) => {
        studentIndex.target.value ? setStudentIndex(studentIndex.target.value) : setStudentIndex('')
    }

    const prepareStudentUser = () => {
        if (email !== '' && password !== '' && name !== '' && surname !== '' && studentIndex !== '') {
            const studentUser = {name: name, surname: surname, studentindex: studentIndex, email: email, password: password}
            props.createStudentUser(studentUser)
        }
    }

    return (
        <React.Fragment>
            <div>
            <Row className={"form-group"}>
                <Col>
                    <Form.Control placeholder="First name" onChange={handleNameChange}/>
                </Col>
                <Col>
                    <Form.Control placeholder="Last name" onChange={handleSurnameChange}/>
                </Col>
            </Row>
            <div className="form-group">
                <input type="text" name="index"  onChange={handleStudentIndexChange}
                       className="form-control"
                       placeholder="Student Index"/>
            </div>
            <div className="form-group">
                <input id="email" type="text" name="email"  onChange={handleEmailChange}
                       className="form-control"
                       placeholder="Email"/>
            </div>
            <div className="form-group">
                <input id="password" type="password" name="password"  onChange={handlePasswordChange}
                       className="form-control" placeholder="Password"/>
            </div>
            <div className={"text-center"}>
                <input type="submit" name="submit" onClick={prepareStudentUser}
                       className="btn btn-success mt-3 mb-4 btn-block" value="Регистрација"/>
            </div>
            </div>
        </React.Fragment>
    )
}

export default StudentRegister;