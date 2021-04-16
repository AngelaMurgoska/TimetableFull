import React, {Component, useState} from "react";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import {Col, Form, FormGroup, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from "moment";
import Menu from "../Menu/Menu";
import TimetableUploadForm from "./TimetableUploadForm/TimetableUploadForm";
import SearchInput from "../SearchField/SearchField";

const TimetableUpload = () => {

    const uploadOptions = [{value: 1, label: "Прикачи во тековен семестар"}, {value: 2, label: "Прикачи во нов семестар"}]
    const [chosenUploadOption, setChosenUploadOption] = useState(1)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [fileUploadUnsuccessfulMessage, setFileUploadUnsuccessfulMessage] = useState('')

    const handleUploadOptionsChange = (options) => {
        options ? setChosenUploadOption(options.value) : setChosenUploadOption('')
    }

    const handleFileUploadError = (errorMessage) => {
        setFileUploadError(true)
        setFileUploadUnsuccessfulMessage(errorMessage)
    }
        return(
            <React.Fragment>
                <Menu/>
               <div>
                   <h4 className="text-center pt-5">Прикачување на нова верзија на распоред</h4>
                   <div className="container mt-4">
                       <Row className="justify-content-center align-items-center">
                           <Col md={6}>
                               <Col md={12}>
                                   {fileUploadError && <Form.Group className={"text-danger"}>{fileUploadUnsuccessfulMessage}</Form.Group>}
                                   <Form.Group>
                                       <SearchInput isClearable={false} onChangeMethod={handleUploadOptionsChange} searchPlaceholder={"Опции за прикачување"} searchData={uploadOptions} defaultValue = {uploadOptions[0]}/>
                                   </Form.Group>
                                   {chosenUploadOption !== '' && <TimetableUploadForm uploadOption = {chosenUploadOption} handleFileUploadError = {handleFileUploadError}/> }
                               </Col>
                           </Col>
                       </Row>
                   </div>
               </div>
            </React.Fragment>
        )
}
export default TimetableUpload;