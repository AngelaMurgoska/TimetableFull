package com.example.demo.models;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@Table(name="semester")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long semesterType; // 0=leten semestar, 1=zimski semestar

    private String academicYear;

    private Long overallSemesterNo;

    private LocalDate startDate;

    private LocalDate endDate;

    public Semester(Long semesterType, String academicYear, LocalDate startDate, LocalDate endDate){
        this.semesterType=semesterType;
        this.academicYear=academicYear;
        this.startDate = startDate;
        this.endDate = endDate;
    }

}
