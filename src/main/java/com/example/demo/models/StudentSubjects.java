package com.example.demo.models;

import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
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

    public Long getId() {
        return id;
    }

    public String getStudentGroupTimetable() {
        return studentGroupTimetable;
    }

    public void setStudentGroupTimetable(String studentGroupTimetable) {
        this.studentGroupTimetable = studentGroupTimetable;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Professor getProfessor() {
        return professor;
    }

    public void setProfessor(Professor professor) {
        this.professor = professor;
    }

    public Semester getSemester() {
        return semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }
}

