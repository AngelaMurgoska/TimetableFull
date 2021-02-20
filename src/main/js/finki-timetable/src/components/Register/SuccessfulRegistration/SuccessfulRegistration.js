import React, {useState} from 'react'
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

const SuccessfulRegistration = () => {
    return (
        <React.Fragment>
            <div>
    Успешна регистрација! <Link to="/login"><Button size = "sm"className={"btn btn-primary"}>Најави се</Button></Link>
            </div>
        </React.Fragment>
    )
}

export default SuccessfulRegistration;