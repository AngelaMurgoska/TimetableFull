import React, {useEffect, useState} from 'react';
import FinkiTimetableService from "../../repository/axiosFinkiTimetableRepository";

const CurrentSemesterInfo = (props) => {

    const [currentSemester, setCurrentSemester] = useState("");

    useEffect(() => {
        FinkiTimetableService.fetchLatestSemester().then((latestSemester) => {
            setCurrentSemester(latestSemester.data);
        })
    }, []);

    return (
        <div>{currentSemester.type === "0" ? 'Летен' : 'Зимски'} семестар {currentSemester.academicYear} година</div>
    )
}

export default CurrentSemesterInfo;