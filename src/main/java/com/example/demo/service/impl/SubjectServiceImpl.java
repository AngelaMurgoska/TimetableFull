package com.example.demo.service.impl;

import com.example.demo.models.Subject;
import com.example.demo.repository.JpaSubjectRepository;
import com.example.demo.service.SubjectService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectServiceImpl implements SubjectService {

    private JpaSubjectRepository repo;

    public SubjectServiceImpl(JpaSubjectRepository repo){
        this.repo=repo;
    }

    @Override
    public List<Subject> getAllSubjects() {
        return repo.findAll();
    }

    @Override
    public Optional<Subject> getSubjectById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Subject getSubjectByName(String name) {
        return  repo.findByName(name);
    }

    @Override
    public void saveSubject(String subjectName) {
        Subject subject = new Subject();
        subject.setName(subjectName);
        repo.save(subject);
    }

}
