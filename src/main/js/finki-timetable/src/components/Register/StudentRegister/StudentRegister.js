import React, {useState} from 'react'
import {Button, Col, Form, Row} from "react-bootstrap";

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
            <Form.Group>
                <Form.Control type="text" name="index"  onChange={handleStudentIndexChange}
                       placeholder="Student Index"/>
            </Form.Group>
            <Form.Group>
                <Form.Control type="email" name="email"  onChange={handleEmailChange}
                       placeholder="Email"/>
            </Form.Group>
            <Form.Group>
                <Form.Control type="password" name="password"  onChange={handlePasswordChange}
                       placeholder="Password"/>
            </Form.Group>
            <div className={"text-center"}>
                <Button variant="success" type="submit" name="submit" onClick={prepareStudentUser}
                        className="mt-3 mb-4 btn-block">Регистрација</Button>
            </div>
            </div>
        </React.Fragment>
    )
}

export default StudentRegister;