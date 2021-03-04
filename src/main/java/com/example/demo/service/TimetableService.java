package com.example.demo.service;


import com.example.demo.models.Timetable;


import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.OptionalLong;

public interface TimetableService {

    List<Timetable> getTimetableByProfessorId(Long profId);

    List<Timetable> getTimetableBySubjectId(Long subjId);

    List<String> getAllRooms();

    List<String> getAllCurrentStudentGroups();

    Long getLatestTimetableVersionInSemester(Long semId);

    List<Timetable> getTimetableByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(Long profId, Long subjId, Long semId, String studentgroup, Long version);

    List<Timetable> getTimetableByProfessorIdAndRoomAndStudentgroupAndSemesterIdAndVersion(Long professorId, String room, String studentGroup, Long semesterId, Long version);

    List<Timetable> getTimetableBySubjectIdAndSemesterIdAndStudentgroupAndVersion(Long subjId, Long semId, String studentgroup, Long version);

    Collection<Timetable> saveAll(Collection<Timetable> exams);

}
