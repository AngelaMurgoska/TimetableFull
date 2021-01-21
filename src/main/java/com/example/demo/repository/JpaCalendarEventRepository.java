package com.example.demo.repository;

import com.example.demo.models.CalendarEvent;
import com.example.demo.models.Student;
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
