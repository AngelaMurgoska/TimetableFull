package com.example.timetable.repository;

import com.example.timetable.models.StudentSubjects;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JpaStudentSubjectsRepository extends JpaRepository<StudentSubjects,Long> {

    List<StudentSubjects> findByStudentId(Long id);

    List<StudentSubjects> findByStudentIdAndSemesterId(Long stuId, Long semId);

}
