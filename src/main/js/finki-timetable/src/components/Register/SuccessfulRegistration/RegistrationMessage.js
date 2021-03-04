import React, {useState} from 'react'
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";

const RegistrationMessage = (props) => {

    const showElement = (elementType) => {
        switch (elementType) {
            case "button": return <Link to="/login"><Button variant="primary" size = "sm">Најави се</Button></Link>
            case "link": return <a href={"/login"} className={"text-primary"}>Најави се</a>
            default: return null
        }
    }

    return (
        <React.Fragment>
            <div>
                {props.message} {showElement(props.type)}
            </div>
        </React.Fragment>
    )
}

export default RegistrationMessage;