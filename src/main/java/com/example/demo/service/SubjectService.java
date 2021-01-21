package com.example.demo.service;

import com.example.demo.models.Subject;

import java.util.List;
import java.util.Optional;

public interface SubjectService {

    List<Subject> getAllSubjects();

    Optional<Subject> getById(Long id);

    Subject getByName(String name);

    void saveSubject(String subjectName);
}
