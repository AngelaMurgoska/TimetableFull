package com.example.timetable.models.nonEntity.timetables;

import lombok.Data;

@Data
public class FilteredTimetable {

    private String subjectName;

    private String professorName;

    private String group;

    private String room;

    private String startTime;

    private String endTime;

    private Long day;

    public FilteredTimetable(){}

    public FilteredTimetable(String subjectName, String professorName, String group, String room, String startTime, String endTime, Long day) {
        this.subjectName = subjectName;
        this.professorName = professorName;
        this.group = group;
        this.room = room;
        this.startTime = startTime;
        this.endTime = endTime;
        this.day = day;
    }

}
