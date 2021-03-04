import React, {useState} from "react"
import {Col, Form, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";

const NewSemesterForm = (props) => {

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [datesErrorMessage, setDatesErrorMessage] = useState('')
    const [semesterType, setSemesterType] = useState('')
    const [academicYear, setAcademicYear] = useState('')
    const [academicYearErrorMessage, setAcademicYearErrorMessage] = useState('')

    const startDateChange = (startDate) => {
        props.setStartDate(startDate)
        let areDatesCorrectlyChosen = moment(startDate).isBefore(endDate);
        if (areDatesCorrectlyChosen) {
            setStartDate(startDate)
            setDatesErrorMessage("")
        } else {
            setDatesErrorMessage("Крајниот датум не може да биде пред почетниот")
        }
    }

    const endDateChange = (endDate) => {
        props.setEndDate(endDate)
        let areDatesCorrectlyChosen = moment(startDate).isBefore(endDate);
        if (areDatesCorrectlyChosen) {
            setEndDate(endDate)
           setDatesErrorMessage("")
        } else {
            setDatesErrorMessage("Крајниот датум не може да биде пред почетниот")
        }
    }

    const semesterTypeChange = (semesterType) => {
        props.setSemesterType(semesterType)
        semesterType.target.value ? setSemesterType(semesterType.target.value) : setSemesterType('')
    }

    const academicYearChange = (academicYear) => {
        props.setAcademicYear(academicYear)
        if(academicYear.target.value.match("^2[0-9]{3}/2[0-9]{3}$") != null) {
            setAcademicYear(academicYear.target.value)
            setAcademicYearErrorMessage("")
        }
        else {
            setAcademicYearErrorMessage("Невалиден формат на година")
        }
    }

    return(
        <React.Fragment>
        <Row className={"form-group align-items-center"}>
            <Col md={7}>
                <Form.Label>Академска година</Form.Label>
                <Form.Control onChange={academicYearChange} type="text" placeholder="пр. 2020/2021" />
                <small className={"text-danger"}>{academicYearErrorMessage}</small>
            </Col>
            <Col>
                <div onChange={semesterTypeChange}>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                               value="0"/>
                        <label className="form-check-label" htmlFor="inlineRadio1">Летен семестар</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                               value="1"/>
                        <label className="form-check-label" htmlFor="inlineRadio2">Зимски семестар</label>
                    </div>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <Form.Label>Почетен датум</Form.Label>
                <DatePicker className={"w-100"} selected={startDate} onChange={startDateChange}/>
            </Col>
            <Col>
                <Form.Label>Краен датум</Form.Label>
                <DatePicker selected={endDate} onChange={endDateChange}/>
            </Col>
        </Row>
        <div className={"mt-1"}><small className={"text-danger"}>{datesErrorMessage}</small></div>
        </React.Fragment>
    )

}

export default NewSemesterForm;