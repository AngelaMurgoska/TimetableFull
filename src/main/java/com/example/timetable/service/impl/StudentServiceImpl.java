package com.example.timetable.service.impl;

import com.example.timetable.models.CalendarEvent;
import com.example.timetable.models.Student;
import com.example.timetable.repository.JpaCalendarEventRepository;
import com.example.timetable.repository.JpaStudentRepository;
import com.example.timetable.service.StudentService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService {

    private JpaStudentRepository studentRepository;

    private JpaCalendarEventRepository calendarEventRepository;

    public StudentServiceImpl(JpaStudentRepository studentRepository, JpaCalendarEventRepository calendarEventRepository){
        this.studentRepository = studentRepository;
        this.calendarEventRepository = calendarEventRepository;
    }

    @Override
    public Student getStudentByStudentindex(Long index) {
        return studentRepository.findByStudentindex(index);
    }

    @Override
    public Student getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    @Override
    public List<CalendarEvent> getAllCalendarEventsFromStudent(Student student) {
        return  calendarEventRepository.findAllByStudent(student);
    }

    @Override
    public void deleteCurrentCalendarEventsFromStudent(Student student) {
        calendarEventRepository.deleteAllByStudent(student);
    }

    @Override
    public void saveTimetableCalendarEventsForStudent(Student student, List<String> eventIds) {
        List<CalendarEvent> eventsForSaving = new ArrayList<>();
        for (String eventId: eventIds) {
            CalendarEvent calendarEvent = new CalendarEvent(eventId, student);
            eventsForSaving.add(calendarEvent);
        }
        calendarEventRepository.saveAll(eventsForSaving);
    }

    @Override
    public void saveStudent(Student student) {
         studentRepository.save(student);
    }

}
