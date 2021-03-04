package com.example.demo.service;

import com.example.demo.models.Subject;

import java.util.List;
import java.util.Optional;

public interface SubjectService {

    List<Subject> getAllSubjects();

    Optional<Subject> getSubjectById(Long id);

    Subject getSubjectByName(String name);

    void saveSubject(String subjectName);
}
