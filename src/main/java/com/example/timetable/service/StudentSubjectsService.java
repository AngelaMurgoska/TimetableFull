package com.example.timetable.service;

import com.example.timetable.models.StudentSubjects;
import com.example.timetable.models.nonEntity.subjectSelections.StudentSubjectSelection;

import java.util.List;

public interface StudentSubjectsService {

    List<StudentSubjects> getByStudentId(Long stuId);

    List<StudentSubjects> getByStudentIdAndSemesterId(Long stuId, Long semId);

    void saveStudentSubjects(List<StudentSubjectSelection> subjectSelections, Long studentindex);

}
