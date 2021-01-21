package com.example.demo.models;

import lombok.Data;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@Table(name="studentsubjects")
public class StudentSubjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String studentGroupTimetable;

    @ManyToOne
    @JoinColumn(name = "student_id", updatable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id", updatable = false)
    private Subject subject;

    @OneToOne
    @JoinColumn(name = "professor_id", updatable = false)
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "semester_id", updatable = false)
    private Semester semester;

}

