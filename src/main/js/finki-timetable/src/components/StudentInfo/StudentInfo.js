import React, {Component} from "react";
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";
import {Button, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";

class StudentInfo extends Component{

    constructor(props,context) {
        super(props, context);
        this.state={
            student: {},
        };
        this.addTimetableToGoogleCalendar = this.addTimetableToGoogleCalendar.bind(this);
    }

    componentDidMount() {
        FinkiTimetableService.fetchStudentInfo(this.props.studentIndex).then(data=>{
            this.setState({student: data.data})
        })
        this.props.populateStudentTimetable(this.props.studentIndex);
    }

    addTimetableToGoogleCalendar(e){
        e.preventDefault();
        FinkiTimetableService.addTimetableToGoogleCalendar(this.state.student.studentindex).then((response) => {
            alert("Timetable successfully added to calendar");
        }).catch((response) => {
            alert("Something went wrong")
        } )
    }

    render() {
        return(
            <div>
                <Row>
                    <Col>
                        <h4>Распоред на часови за студентот:</h4>
                        <div>{this.state.student.name} {this.state.student.surname} {this.state.student.studentindex}</div>
                    </Col>
                    <Col className={"text-right"}>
                        <Button type={"primary"} onClick={this.addTimetableToGoogleCalendar}>Export to Google Calendar</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default StudentInfo;