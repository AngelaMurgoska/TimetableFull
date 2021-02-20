package com.example.demo.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
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

    private String email;

    public Student(String name, String surname, Long studentindex, String email) {
        this.name = name;
        this.surname = surname;
        this.studentindex = studentindex;
        this.email = email;
    }
}

