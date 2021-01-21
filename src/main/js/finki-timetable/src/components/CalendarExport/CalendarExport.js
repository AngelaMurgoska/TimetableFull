import React from 'react';
import {Button} from "react-bootstrap";
import Col from "react-bootstrap/Col";

const CalendarExport = (props) => {
    return (
        <Button type={"primary"} onClick={props.addTimetableToCalendar}>Export to Google Calendar</Button>
    )
}

export default CalendarExport;