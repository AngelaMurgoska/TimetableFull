package com.example.demo.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@Table(name="timetable")
public class Timetable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hourFrom;

    private Long hourTo;

    private Long day;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String room;

    @Nationalized
    @Column(columnDefinition = "NVARCHAR(255)")
    private String studentgroup;

    private Long version;

    @ManyToOne
    @JoinColumn(name = "professor_id", updatable = false)
    private Professor professor;

    @ManyToOne
    @JoinColumn(name = "subject_id", updatable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "semester_id", updatable = false)
    private Semester semester;

    public Timetable(Long hourFrom, Long hourTo, Long day, String room, String studentgroup, Professor professor, Subject subject, Semester semester, Long version) {
        this.hourFrom = hourFrom;
        this.hourTo = hourTo;
        this.day = day;
        this.room = room;
        this.studentgroup = studentgroup;
        this.professor = professor;
        this.subject = subject;
        this.semester = semester;
        this.version = version;
    }

    /*hh:mm, hours 8 and 0 become 08:00 and 09:00*/
    public String getHourFromInDoubleDigitFormatWithMinutes() {
        String startTime = hourFrom < 10 ? "0" + String.valueOf(hourFrom) : String.valueOf(hourFrom);
        return startTime + ":00";
    }

    /*hh:mm, hours 8 and 0 become 08:00 and 09:00*/
    public String getHourToInDoubleDigitFormatWithMinutes() {
        String endTime = hourTo < 10 ? "0" + String.valueOf(hourTo) : String.valueOf(hourTo);
        return endTime + ":00";
    }
}
