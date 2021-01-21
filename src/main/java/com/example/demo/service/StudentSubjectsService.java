package com.example.demo.service;

import com.example.demo.models.StudentSubjects;
import com.example.demo.models.nonEntity.subjectSelections.StudentSubjectSelection;

import java.util.List;

public interface StudentSubjectsService {

    List<StudentSubjects> getByStudentId(Long stuId);

    List<StudentSubjects> getByStudentIdAndSemesterId(Long stuId, Long semId);

    void saveStudentSubjects(List<StudentSubjectSelection> subjectSelections, Long studentindex);

}
