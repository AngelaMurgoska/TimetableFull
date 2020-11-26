import React, {Component} from 'react';
import './App.css';
import Timetable from "react-timetable-events";
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";
import SearchBar from "../SearchBar/SearchBar";
import moment from "moment";
import Section from "../Section/Section";
import StudentInfo from "../StudentInfo/StudentInfo";
import TimetableUpload from "../TimetableUpload/TimetableUpload";
import {Col, Row} from "react-bootstrap";
import Menu from "../Menu/Menu";

class App extends Component {

    constructor(props, context) {
       super(props, context);
        this.state = {
            student:{},
            timetableProps: {
                events: {
                    monday:[],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: []
                },
                hoursInterval: [8, 21],
                timeLabel: "Time",
                renderHour(hour, defaultAttributes, styles) {
                    return (
                        <div {...defaultAttributes} key={hour}>
                            {hour}
                        </div>
                    );
                },
                renderEvent(event, defaultAttributes, styles) {
                    return (
                        <div {...defaultAttributes} title={event.name} key={event.id}>
                            <span className={styles.event_info}>{event.subjectName}</span>
                            <span className={styles.event_info}>{event.professorName + ' Група '+ event.group}</span>
                            <span className={styles.event_info}>{event.room}</span>
                            <span className={styles.event_info}>
                {event.startTime} - {" "}
                                {event.endTime}
              </span>
                        </div>
                    );
                }
            }
        };
    }

    populateFilteredTimetable = (professorId, room) =>{
        FinkiTimetableService.fetchFilteredTimetableForDay(1,professorId,room).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.monday= data.data;
                return {timetableProps};
            })
        );
        FinkiTimetableService.fetchFilteredTimetableForDay(2,professorId,room).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.tuesday= data.data;
                return {timetableProps};
            })
        );
        FinkiTimetableService.fetchFilteredTimetableForDay(3,professorId,room).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.wednesday= data.data;
                return {timetableProps};
            })
        );
        FinkiTimetableService.fetchFilteredTimetableForDay(4,professorId,room).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.thursday= data.data;
                return {timetableProps};
            })
        );
        FinkiTimetableService.fetchFilteredTimetableForDay(5,professorId,room).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.friday= data.data;
                return {timetableProps};
            })
        );
    }

    populateStudentTimetable = (studentIndex)=>{
        FinkiTimetableService.fetchStudentTimetableForDay(studentIndex,1).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.monday= data.data;
                return {timetableProps};
            }))
        FinkiTimetableService.fetchStudentTimetableForDay(studentIndex,2).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.tuesday= data.data;
                return {timetableProps};
            }))
        FinkiTimetableService.fetchStudentTimetableForDay(studentIndex,3).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.wednesday= data.data;
                return {timetableProps};
            }))
        FinkiTimetableService.fetchStudentTimetableForDay(studentIndex,4).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.thursday= data.data;
                return {timetableProps};
            }))
        FinkiTimetableService.fetchStudentTimetableForDay(studentIndex,5).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.friday= data.data;
                return {timetableProps};
            }))
    }

    render() {
       const studentIndex= this.props.match.params.studentId;
       if(studentIndex==null){
           return (
               <React.Fragment>
                   <Menu/>
                   <Row>
                       <Col md={7}>
                           <Section>
                               <SearchBar populateFilteredTimetable={this.populateFilteredTimetable}/>
                           </Section>
                       </Col>
                       <Col>
                           <Section>
                               {(sessionStorage.getItem("jwt") && sessionStorage.getItem("role")==="ROLE_STAFF") ? <TimetableUpload/> : <span></span>}
                           </Section>
                       </Col>
                   </Row>
                   <Timetable {...this.state.timetableProps} />
               </React.Fragment>
           )
       }
       else{
           return (
               <React.Fragment>
                   <Menu/>
                   <Section>
                       <StudentInfo studentIndex={studentIndex} populateStudentTimetable={this.populateStudentTimetable}/>
                   </Section>
                   <Timetable {...this.state.timetableProps} />
               </React.Fragment>
           )
       }
    }
}

export default App;
