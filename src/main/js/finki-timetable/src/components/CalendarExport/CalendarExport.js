import React from 'react';
import {Button} from "react-bootstrap";

const CalendarExport = (props) => {
    return (
        <Button type={"primary"} onClick={props.addTimetableToCalendar}>Export to Google Calendar</Button>
    )
}

export default CalendarExport;