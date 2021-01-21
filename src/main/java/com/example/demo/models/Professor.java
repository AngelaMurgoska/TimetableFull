package com.example.demo.models;

import lombok.Data;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@Table(name="professor")
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String name;

}
