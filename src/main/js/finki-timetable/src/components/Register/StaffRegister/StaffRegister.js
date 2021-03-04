import React, {useState} from 'react'
import {Button, Form} from "react-bootstrap";

const StaffRegister = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //TODO validation if you have the time
    const handleEmailChange = (email) => {
        email.target.value ? setEmail(email.target.value) : setEmail('')
    }

    const handlePasswordChange = (password) => {
        password.target.value ? setPassword(password.target.value) : setPassword('')
    }

    const prepareStaffUser = () => {
        if (email !== '' && password !== '') {
            const staffUser = {userName: email, password: password}
            props.createStaffUser(staffUser)
        }
    }

    return (
        <React.Fragment>
        <Form.Group>
            <Form.Control type="email" name="email"  onChange={handleEmailChange}
                   placeholder="Email"/>
        </Form.Group>
        <Form.Group>
        <Form.Control type="password" name="password"  onChange={handlePasswordChange}
                    placeholder="Password"/>
        </Form.Group>
            <div className={"text-center"}>
                <Button variant="success" type="submit" onClick={prepareStaffUser}
                        className="mt-3 mb-4 btn-block">Регистрација</Button>
            </div>
        </React.Fragment>
    )
}

export default StaffRegister;