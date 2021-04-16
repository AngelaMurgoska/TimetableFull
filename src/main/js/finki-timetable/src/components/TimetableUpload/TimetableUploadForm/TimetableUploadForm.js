import React,{Component} from "react";
import GeneralFinkiTimetableApi from "../../../api/generalFinkiTimetableApi";
import {Button, Col, Form, FormGroup, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from "moment";
import NewSemesterForm from "../NewSemesterForm/NewSemesterForm";

class TimetableUploadForm extends Component{

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            semesterType: "",
            semesterAcademicYear: "",
            messageAcademicYear: "",
            messageErrorDates: "",
            startDate: new Date(),
            endDate: new Date()
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onFileChange = this.onFileChange.bind(this)
        this.semesterTypeChange=this.semesterTypeChange.bind(this);
        this.semesterAcademicYearChange=this.semesterAcademicYearChange.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.endDateChange = this.endDateChange.bind(this);
    }


    onFormSubmit(e){
        e.preventDefault();// Stop form submit

        if (this.state.file == null) {
            return
        }
        let type=this.state.semesterType;
        let academicYear=this.state.semesterAcademicYear;
        let messageAcademicYear = this.state.messageAcademicYear;
        let messageErrorDates = this.state.messageErrorDates;
        let startDate =  moment(this.state.startDate).format("YYYY-MM-DD");
        let endDate =  moment(this.state.endDate).format("YYYY-MM-DD");

        if(this.props.uploadOption === 1){
            type = academicYear = startDate = endDate = messageAcademicYear = messageErrorDates = "";
        } else if (type == null || messageAcademicYear !== "" || messageErrorDates !== "" ) {
            return
        }

        GeneralFinkiTimetableApi.uploadFile(this.state.file, type, academicYear, startDate, endDate).then((response) => {
            alert("Распоредот е успешно прикачен")
        }).catch((error) => {
            this.props.handleFileUploadError(error.response.data)
        });
    }

    onFileChange(e) {
        this.setState({file:e.target.files[0]});
    }

    semesterTypeChange(e){
        this.setState({semesterType: e.target.value})
    }

    semesterAcademicYearChange(e){
        if(e.target.value.match("^2[0-9]{3}/2[0-9]{3}$") != null) {
            this.setState({semesterAcademicYear: e.target.value})
            this.setState({messageAcademicYear: ""})
        }
        else this.setState({messageAcademicYear: "невалиден формат на година"})
    }

    startDateChange(startDate) {
        let areDatesCorrectlyChosen = moment(startDate).isBefore(this.state.endDate);
        if (areDatesCorrectlyChosen) {
            this.setState({startDate: startDate})
            this.state.messageErrorDates = ""
        } else {
            this.setState({messageErrorDates: "Крајниот датум не може да биде пред почетниот"})
        }
    }

    endDateChange(endDate) {
        let areDatesCorrectlyChosen = moment(this.state.startDate).isBefore(endDate);
        if (areDatesCorrectlyChosen) {
            this.setState({endDate: endDate});
            this.state.messageErrorDates = ""
        } else {
            this.setState({messageErrorDates: "Крајниот датум не може да биде пред почетниот"})
        }
    }

//TODO show a message after a successful upload
    render() {
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        return(
            <React.Fragment>
                <form onSubmit={this.onFormSubmit} encType="multipart/form-data">
                    <Row className={"form-group"}>
                        <Col>
                            <Form.File onChange = {this.onFileChange} className={"form-control-file"} id="file" label="Прикачи .csv фајл" accept={".csv"}/>
                        </Col>
                    </Row>
                    {this.props.uploadOption === 2 && <NewSemesterForm
                        setSemesterType = {this.semesterTypeChange}
                        setAcademicYear = {this.semesterAcademicYearChange}
                        setStartDate = {this.startDateChange}
                        setEndDate = {this.endDateChange}
                    />}
                    <Button variant="primary" type="submit" className="mt-3 mb-4 btn-block">Прикачи распоред</Button>
                </form>
            </React.Fragment>
        )
    }
}
export default TimetableUploadForm;