package com.example.timetable.service;

import com.example.timetable.models.Professor;

import java.util.List;
import java.util.Optional;

public interface ProfessorService {

    List<Professor> getAllProfessors();

    Professor getProfessorByName(String name);

    Optional<Professor> getProfessorById(Long id);

    void saveProfessor(String professorName);

}
