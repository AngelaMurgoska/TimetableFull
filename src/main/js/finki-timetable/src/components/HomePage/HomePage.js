import React, {Component} from 'react';
import './HomePage.css';
import Timetable from "react-timetable-events";
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";
import SearchSection from "../SearchSection/SearchSection";
import Section from "../Section/Section";
import {Col, Row} from "react-bootstrap";
import Menu from "../Menu/Menu";

class HomePage extends Component {

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


    render() {
        return (
            <React.Fragment>
                <Menu/>
                <Row>
                    <Col>
                        <Section>
                            <SearchSection populateFilteredTimetable={this.populateFilteredTimetable}/>
                        </Section>
                    </Col>
                </Row>
                <Timetable {...this.state.timetableProps} />
            </React.Fragment>
        )
    }
}

export default HomePage;
