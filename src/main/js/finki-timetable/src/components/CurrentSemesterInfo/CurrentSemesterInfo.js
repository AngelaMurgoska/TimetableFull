import React, {useEffect, useState} from 'react';
import GeneralFinkiTimetableApi from "../../api/generalFinkiTimetableApi";

const CurrentSemesterInfo = (props) => {

    const [currentSemester, setCurrentSemester] = useState("");

    useEffect(() => {
        GeneralFinkiTimetableApi.fetchLatestSemester().then((latestSemester) => {
            console.log(latestSemester.data)
            setCurrentSemester(latestSemester.data);
        })
    }, []);

    return (
        <div>{currentSemester.semesterType == 0 ? 'Летен' : 'Зимски'} семестар {currentSemester.academicYear} година</div>
    )
}

export default CurrentSemesterInfo;