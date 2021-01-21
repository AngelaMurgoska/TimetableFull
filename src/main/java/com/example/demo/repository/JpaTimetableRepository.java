package com.example.demo.repository;

import com.example.demo.models.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JpaTimetableRepository extends JpaRepository<Timetable,Long> {

    List<Timetable> findByProfessorId(Long id);

    List<Timetable> findBySubjectId(Long id);

    @Query("SELECT DISTINCT(t.room) FROM Timetable t")
    List<String> getAllRooms();

    @Query("SELECT DISTINCT(t.studentgroup) FROM Timetable t  WHERE t.semester.id=:semester_id and t.version = :version")
    List<String> getAllStudentGroups(@Param("semester_id") Long semId, @Param("version") Long version);

    @Query("SELECT MAX(t.version) FROM Timetable t WHERE t.semester.id=:semester_id")
    Optional<Long> findLatestTimetableVersionInSemester(@Param("semester_id") Long semId);

    List<Timetable> findByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(Long profId,Long subjId, Long semId, String studentgroup, Long version);

    List<Timetable> findBySubjectIdAndSemesterIdAndStudentgroupAndVersion(Long subjId, Long semId, String studentgroup, Long version);

    @Query("SELECT t FROM Timetable t WHERE (:professorId is null or t.professor.id = :professorId) and (:room is null"
            + " or t.room = :room) and (:studentGroup is null or t.studentgroup = :studentGroup) and t.semester.id = :semesterId and t.version = :version")
    List<Timetable> findByProfessorIdAndRoomAndStudentgroupAndSemesterIdAndVersion(@Param("professorId") Long professorId, @Param("room") String room, @Param("studentGroup") String studentGroup, @Param("semesterId") Long semesterId, @Param("version") Long version);

    @Override
    <S extends Timetable> List<S> saveAll(Iterable<S> iterable);
}
