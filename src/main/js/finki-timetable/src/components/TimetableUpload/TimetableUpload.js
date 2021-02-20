import React,{Component} from "react";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import {Col, Form, FormGroup, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as moment from "moment";

class TimetableUpload extends Component{

    constructor(props) {
        super(props);
        this.state ={
            file:null,
            visibility: {
                formClass: "d-none",
                shouldHide: true,
            },
            semesterType: "",
            semesterAcademicYear: "",
            messageAcademicYear: "",
            messageErrorDates: "",
            startDate: new Date(),
            endDate: new Date()
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.changeVisibility=this.changeVisibility.bind(this);
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

        if(this.state.visibility.shouldHide){
            type = academicYear = startDate = endDate = messageAcademicYear = messageErrorDates = "";
        } else if (type == null || messageAcademicYear !== "" || messageErrorDates !== "" ) {
            return
        }

        GeneralFinkiTimetableApi.uploadFile(this.state.file, type, academicYear, startDate, endDate).then((response) => {
        }).catch((error) => {
            console.log(error.response.data)
        });
    }

    onChange(e) {
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

    changeVisibility(e) {
        this.setState((prevState) => {
                let visibility = {...prevState.visibility};
                visibility.shouldHide = !prevState.visibility.shouldHide;
                visibility.formClass = visibility.shouldHide ? "d-none" : "";
                return {visibility};
            }
        );
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


    render() {
        const startDate = this.state.startDate;
        const endDate = this.state.endDate;
        return(
            <React.Fragment>
                <form  onSubmit={this.onFormSubmit} encType="multipart/form-data">
                    <h4 className={"mb-1"}>Upload на нова верзија на распоред</h4>
                    <Row>
                        <Col md={2}>
                            <Form.Group className={"mb-2"}>
                                <Form.File onChange = {this.onChange} className={"form-control-file  mt-2"} id="file" label="Прикачи .csv фајл" accept={".csv"}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <button type="submit" className="btn btn-primary mt-2">Прикачи распоред</button>
                        </Col>
                    </Row>
                    <Row className={"align-items-end"}>
                        <Col md={6}>
                            <div className="form-check">
                                <input onChange={this.changeVisibility} className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                <label className="form-check-label" htmlFor="defaultCheck1">
                                    Нов семестар
                                </label>
                            </div>
                            <div className={this.state.visibility.formClass} >
                                <div onChange={this.semesterTypeChange}>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                                               value="0"/>
                                        <label className="form-check-label" htmlFor="inlineRadio1">летен</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                               value="1"/>
                                        <label className="form-check-label" htmlFor="inlineRadio2">зимски</label>
                                    </div>
                                </div>
                                <Row>
                                    <Col>
                                        <label htmlFor="academicYear">Академска година</label>
                                        <input onChange={this.semesterAcademicYearChange} id="academicYear" type="text" placeholder={"пр. 2017/2018"}/>
                                        <div className={"mt-1"}><small className={"text-danger"}>{this.state.messageAcademicYear}</small></div>
                                    </Col>
                                    <Col>
                                        <label htmlFor="academicYear">Почетен датум</label>
                                        <DatePicker selected={startDate} onChange={this.startDateChange}/>
                                    </Col>
                                    <Col>
                                        <label htmlFor="academicYear">Краен датум</label>
                                        <DatePicker selected={endDate} onChange={this.endDateChange}/>
                                        <div className={"mt-1"}><small className={"text-danger"}>{this.state.messageErrorDates}</small></div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                </form>
            </React.Fragment>
        )
    }
}
export default TimetableUpload;