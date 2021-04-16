package com.example.timetable.repository;

import com.example.timetable.models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JpaProfessorRepository extends JpaRepository<Professor,Long> {

    List<Professor> findAll();

    Professor findByName(String name);

    Optional<Professor> findById(Long id);

}
