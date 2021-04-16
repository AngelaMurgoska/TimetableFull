package com.example.timetable.repository;

import com.example.timetable.models.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaSubjectRepository extends JpaRepository<Subject,Long> {

    List<Subject> findAll();

    Optional<Subject> findById(Long id);

    Subject findByName(String name);

}
