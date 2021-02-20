import React, {useState} from 'react'

const StaffRegister = (props) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    //TODO validation if you have the time
    const handleEmailChange = (email) => {
        email.target.value ? setEmail(email.target.value) : setEmail('')
    }

    //TODO add another field to validate password if you have the time
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
                <input type="submit" name="submit" onClick={prepareStaffUser}
                       className="btn btn-success mt-3 mb-4 btn-block" value="Регистрација"/>
            </div>
        </React.Fragment>
    )
}

export default StaffRegister;