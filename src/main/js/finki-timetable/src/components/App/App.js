import React, {Component} from 'react';
import './App.css';
import Timetable from "react-timetable-events";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import SearchBar from "../SearchBar/SearchBar";
import moment from "moment";
import Section from "../Section/Section";
import StudentInfo from "../StudentInfo/StudentInfo";
import TimetableUpload from "../TimetableUpload/TimetableUpload";
import {Col, Row} from "react-bootstrap";
import Menu from "../Menu/Menu";
import SubjectSetup from "../SubjectSetup/SubjectSetup";

class App extends Component {

    constructor(props, context) {
       super(props, context);
        this.state = {
            student:{},
            timetablePresent: "no info",
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

    populateFilteredTimetable = (professorId, room, studentGroup) =>{
        GeneralFinkiTimetableApi.fetchFilteredTimetableForDay(1,professorId,room, studentGroup).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.monday= data.data;
                return {timetableProps};
            })
        );
        GeneralFinkiTimetableApi.fetchFilteredTimetableForDay(2,professorId,room, studentGroup).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.tuesday= data.data;
                return {timetableProps};
            })
        );
        GeneralFinkiTimetableApi.fetchFilteredTimetableForDay(3,professorId,room, studentGroup).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.wednesday= data.data;
                return {timetableProps};
            })
        );
        GeneralFinkiTimetableApi.fetchFilteredTimetableForDay(4,professorId,room, studentGroup).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.thursday= data.data;
                return {timetableProps};
            })
        );
        GeneralFinkiTimetableApi.fetchFilteredTimetableForDay(5,professorId,room, studentGroup).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.friday= data.data;
                return {timetableProps};
            })
        );
    }

    populateStudentTimetable = (studentIndex)=>{
        GeneralFinkiTimetableApi.fetchStudentTimetableForDay(studentIndex,1).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.monday= data.data;
                return {timetableProps};
            }))
        GeneralFinkiTimetableApi.fetchStudentTimetableForDay(studentIndex,2).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.tuesday= data.data;
                return {timetableProps};
            }))
        GeneralFinkiTimetableApi.fetchStudentTimetableForDay(studentIndex,3).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.wednesday= data.data;
                return {timetableProps};
            }))
        GeneralFinkiTimetableApi.fetchStudentTimetableForDay(studentIndex,4).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.thursday= data.data;
                return {timetableProps};
            }))
        GeneralFinkiTimetableApi.fetchStudentTimetableForDay(studentIndex,5).then(data=>
            this.setState((prevState)=>{
                let timetableProps={...prevState.timetableProps};
                timetableProps.events.friday= data.data;
                return {timetableProps};
            }))
    }

    componentDidMount() {
        const studentIndex = this.props.match.params.studentId;
        if (studentIndex == null) {
            this.setState({timetablePresent: false})
        } else {
            GeneralFinkiTimetableApi.checkIfStudentHasSubjectsInCurrentSemester(studentIndex).then((response) => {
                console.log(response.data)
                this.setState(
                    {timetablePresent: response.data}
                )
            });
        }
    }

    render() {
       const studentIndex = this.props.match.params.studentId;
       if(studentIndex==null){
           return (
               <React.Fragment>
                   <Menu/>
                   {(sessionStorage.getItem("jwt") && sessionStorage.getItem("role")==="ROLE_STAFF") ? <Row>
                       <Col><Section><TimetableUpload/></Section></Col></Row> : <span></span>}
                   <Row>
                       <Col>
                           <Section>
                               <SearchBar populateFilteredTimetable={this.populateFilteredTimetable}/>
                           </Section>
                       </Col>
                   </Row>
                   <Timetable {...this.state.timetableProps} />
               </React.Fragment>
           )
       }
       else {
           let timetable, subjectSelection;
           if (this.state.timetablePresent === "no info") {
               return <div></div>
           } else {
               if (this.state.timetablePresent) {
                   timetable = <Timetable {...this.state.timetableProps} />
                   subjectSelection = false
               } else {
                   timetable = <SubjectSetup studentindex = {studentIndex}/>
                   subjectSelection = true
               }
               return (
                   <React.Fragment>
                       <Menu/>
                       <Section>
                           <StudentInfo studentIndex={studentIndex} populateStudentTimetable={this.populateStudentTimetable} subjectSelection = {subjectSelection}/>
                       </Section>
                       {timetable}
                   </React.Fragment>
               )
           }
       }
    }
}

export default App;
