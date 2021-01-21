package com.example.demo.models.nonEntity.timetables;

import lombok.Data;

@Data
public class StudentTimetable {

    private String name;

    private String surname;

    private Long studentindex;

    private String module;

    private String subjectName;

    private String professorName;

    private String group;

    private String room;

    private String startTime;

    private String endTime;

    private Long day;

    public StudentTimetable() {}

    public StudentTimetable(String name, String surname, Long studentindex, String module, String subjectName, String professorName, String group, String room, String hourFrom, String hourTo, Long day) {
        this.name = name;
        this.surname = surname;
        this.studentindex = studentindex;
        this.module = module;
        this.subjectName = subjectName;
        this.professorName = professorName;
        this.group = group;
        this.room = room;
        this.startTime = hourFrom;
        this.endTime = hourTo;
        this.day=day;
    }

    /*8 and 9 will be returned as 08 and 09*/
    public String getStartTimeInDoubleDigitFormat() {
       return startTime.length() < 4 ? "0" + startTime : startTime;
    }

    /*8 and 9 will be returned as 08 and 09*/
    public String getEndTimeInDoubleDigitFormat() {
        return endTime.length() < 4 ? "0" + endTime : endTime;
    }

}
