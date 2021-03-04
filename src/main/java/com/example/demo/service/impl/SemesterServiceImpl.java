package com.example.demo.service.impl;


import com.example.demo.models.Semester;
import com.example.demo.repository.JpaSemesterRepository;
import com.example.demo.service.SemesterService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SemesterServiceImpl implements SemesterService{

    private JpaSemesterRepository repo;

    public SemesterServiceImpl(JpaSemesterRepository repo){
        this.repo=repo;
    }

    @Override
    public List<Semester> getAllSemesters() {
        return repo.findAll();
    }

    @Override
    public Optional<Semester> getSemesterById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Semester saveSemester(Semester s) {
        return repo.save(s);
    }

    @Override
    public Semester getLatestSemester() {
        return repo.findFirstByOrderByOverallSemesterNoDesc();
    }

    @Override
    public Long getMaxOverallSemesterNo() {
        return repo.getMaxOverallSemesterNo();
    }

    @Override
    public void createNewSemester(Long semesterType, String academicYear, LocalDate startDate, LocalDate endDate) {
        Semester newSemester=new Semester(semesterType,academicYear, startDate, endDate);
        saveSemester(newSemester);
        Long currentLatestSemester=getMaxOverallSemesterNo();
        currentLatestSemester = currentLatestSemester != null ? currentLatestSemester : 0L;
        newSemester.setOverallSemesterNo(currentLatestSemester+1);
    }

}
