package com.example.demo.models;

import lombok.Data;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@Table(name="student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String name;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String surname;

    private Long studentindex;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String module;

    private String email;

    private Long currentSemester; //koj semestar mu e po red na studentot

}

