package com.example.timetable.service;

import com.example.timetable.models.Semester;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SemesterService {

    List<Semester> getAllSemesters();

    Optional<Semester> getSemesterById(Long id);

    Semester saveSemester(Semester s);

    Semester getLatestSemester();

    Long getMaxOverallSemesterNo();

    void createNewSemester(Long semesterType, String academicYear, LocalDate startDate, LocalDate endDate);

}
