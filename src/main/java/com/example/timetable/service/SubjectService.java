package com.example.timetable.service;

import com.example.timetable.models.Subject;

import java.util.List;
import java.util.Optional;

public interface SubjectService {

    List<Subject> getAllSubjects();

    Optional<Subject> getSubjectById(Long id);

    Subject getSubjectByName(String name);

    void saveSubject(String subjectName);
}
