package com.example.timetable.repository;

import com.example.timetable.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaStudentRepository extends JpaRepository<Student, Long> {

    Student findByStudentindex(Long index);

    Student findByEmail(String email);

}
