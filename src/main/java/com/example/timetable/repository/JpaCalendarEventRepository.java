package com.example.timetable.repository;

import com.example.timetable.models.CalendarEvent;
import com.example.timetable.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface JpaCalendarEventRepository extends JpaRepository<CalendarEvent,Long> {

     List<CalendarEvent> findAllByStudent(Student student);

     @Transactional
     void deleteAllByStudent(Student student);

     @Override
     <S extends CalendarEvent> List<S> saveAll(Iterable<S> iterable);

}
