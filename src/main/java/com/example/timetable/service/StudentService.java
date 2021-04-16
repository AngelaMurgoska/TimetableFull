package com.example.timetable.service;

import com.example.timetable.models.CalendarEvent;
import com.example.timetable.models.Student;

import java.util.List;

public interface StudentService {

    Student getStudentByStudentindex(Long index);

    Student getStudentByEmail(String email);

    //TODO is it needed?
    List<CalendarEvent> getAllCalendarEventsFromStudent(Student student);

    void deleteCurrentCalendarEventsFromStudent(Student student);

    void saveTimetableCalendarEventsForStudent(Student student, List<String> eventIds);

    void saveStudent(Student student);

}
