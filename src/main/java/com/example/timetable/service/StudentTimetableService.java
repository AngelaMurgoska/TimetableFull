package com.example.timetable.service;

import com.example.timetable.models.Semester;
import com.example.timetable.models.Student;
import com.example.timetable.models.StudentSubjects;
import com.example.timetable.models.nonEntity.timetables.StudentTimetable;

import java.util.List;

public interface StudentTimetableService {

    List<StudentTimetable> getStudentTimetableLatestVersion(Student student, Semester semester, List<StudentSubjects> studentSubjects);

}
