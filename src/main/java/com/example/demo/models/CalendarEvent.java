package com.example.demo.models;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@Table(name="calendarevent")
public class CalendarEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String eventId;

    //TODO check if updateable should be present
    @ManyToOne
    @JoinColumn(name = "student_id", updatable = false)
    private Student student;

    public CalendarEvent(String eventId, Student student) {
        this.eventId = eventId;
        this.student = student;
    }
}
