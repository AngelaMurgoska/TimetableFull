package com.example.demo.service;

import com.example.demo.models.CalendarEvent;
import com.example.demo.models.Student;
import com.example.demo.models.nonEntity.timetables.StudentTimetable;

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
