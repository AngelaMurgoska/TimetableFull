package com.example.timetable.service.impl;

import com.example.timetable.models.Professor;
import com.example.timetable.repository.JpaProfessorRepository;
import com.example.timetable.service.ProfessorService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfessorServiceImpl implements ProfessorService {

    private JpaProfessorRepository repo;

    public ProfessorServiceImpl(JpaProfessorRepository repo){
        this.repo=repo;
    }

    @Override
    public List<Professor> getAllProfessors() {
        List<Professor> professors = repo.findAll();
        if (professors != null) {
            return professors;
        } else {
            return new ArrayList<Professor>();
        }
    }

    @Override
    public Professor getProfessorByName(String name) {
        return repo.findByName(name);
    }

    @Override
    public Optional<Professor> getProfessorById(Long id) {
        return repo.findById(id);
    }

    @Override
    public void saveProfessor(String professorName) {
        Professor professor = new Professor();
        professor.setName(professorName);
        repo.save(professor);
    }

}
