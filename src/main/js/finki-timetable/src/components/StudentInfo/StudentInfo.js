import React, {Component} from "react";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import {Button, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import CalendarExport from "../CalendarExport/CalendarExport";
import CurrentSemesterInfo from "../CurrentSemesterInfo/CurrentSemesterInfo";

class StudentInfo extends Component{

    constructor(props,context) {
        super(props, context);
        this.state={
            student: {},
        };
        this.addTimetableToGoogleCalendar = this.addTimetableToGoogleCalendar.bind(this);
    }

    componentDidMount() {
        GeneralFinkiTimetableApi.fetchStudentInfo(this.props.studentIndex).then(data=>{
            this.setState({student: data.data})
        })
        this.props.populateStudentTimetable(this.props.studentIndex);
    }

    addTimetableToGoogleCalendar(e){
        e.preventDefault();
        GeneralFinkiTimetableApi.addTimetableToGoogleCalendar(this.state.student.studentindex).then((response) => {
            alert("Timetable successfully added to calendar");
        }).catch((response) => {
            alert("Something went wrong")
        } )
    }

    render() {
        return(
            <div className={"mb-3"}>
                <Row className={"align-items-center"}>
                    <Col>
                        <h4>Распоред на часови за студентот:</h4>
                        <div>{this.state.student.name} {this.state.student.surname} {this.state.student.studentindex}</div>
                        <CurrentSemesterInfo/>
                    </Col>
                    {!this.props.subjectSelection && <Col className={"text-right"}>
                        <CalendarExport addTimetableToCalendar = {this.addTimetableToGoogleCalendar}/>
                    </Col>}
                </Row>
            </div>
        )
    }
}

export default StudentInfo;