import React, {Component} from 'react';
import Menu from "../Menu/Menu";
import Section from "../Section/Section";
import Timetable from "react-timetable-events";
import SubjectSetup from "../SubjectSetup/SubjectSetup";
import StudentInfo from "../StudentInfo/StudentInfo";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";

class StudentTimetable extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
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
        }
    }

    componentDidMount() {
        const studentindex = this.props.match.params.studentId;
        if (studentindex == null) {
            this.setState({timetablePresent: false})
        } else {
            GeneralFinkiTimetableApi.checkIfStudentHasSubjectsInCurrentSemester(studentindex).then((response) => {
                this.setState(
                    {timetablePresent: response.data}
                )
            });
        }
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

    render() {
        const studentindex = this.props.match.params.studentId;
        if(studentindex == null){
            return null
        } else {
            let timetable, subjectSelection;
            if (this.state.timetablePresent === "no info") {
                return null
            } else {
                if (this.state.timetablePresent) {
                    timetable = <Timetable {...this.state.timetableProps} />
                    subjectSelection = false
                } else {
                    timetable = <SubjectSetup studentindex = {studentindex}/>
                    subjectSelection = true
                }
                return (
                    <React.Fragment>
                        <Menu/>
                        <Section>
                            <StudentInfo studentIndex={studentindex} populateStudentTimetable={this.populateStudentTimetable} subjectSelection = {subjectSelection}/>
                        </Section>
                        {timetable}
                    </React.Fragment>
                )
            }
        }
    }
}

export default StudentTimetable;
