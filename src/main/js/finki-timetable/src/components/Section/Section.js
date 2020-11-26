import React, {Component} from 'react';
import {Col, Row} from "react-bootstrap";


const Section = (props) => {

    return(
        <div className={"pt-4 mb-3 pl-5"}>
            {props.children}
        </div>
    )

}

export default Section;