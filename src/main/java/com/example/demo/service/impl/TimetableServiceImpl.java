package com.example.demo.service.impl;

import com.example.demo.models.Semester;
import com.example.demo.models.Timetable;
import com.example.demo.repository.JpaTimetableRepository;
import com.example.demo.service.SemesterService;
import com.example.demo.service.TimetableService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TimetableServiceImpl implements TimetableService {

    private JpaTimetableRepository repo;
    private SemesterService semesterService;

    public TimetableServiceImpl(JpaTimetableRepository repo, SemesterServiceImpl semesterService){
        this.repo=repo;
        this.semesterService = semesterService;
    }

    @Override
    public List<Timetable> getTimetableByProfessorId(Long profId) {
        return repo.findByProfessorId(profId);
    }

    @Override
    public List<Timetable> getTimetableBySubjectId(Long subjId) {
        return repo.findBySubjectId(subjId);
    }

    @Override
    public List<String> getAllRooms() {
        List<String> rooms = repo.getAllRooms();
        if (rooms != null) {
            return rooms;
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public List<String> getAllCurrentStudentGroups() {
        Long currentSemesterId = semesterService.getLatestSemester().getId();
        Long latestTimetableVersion = getLatestTimetableVersionInSemester(currentSemesterId);
        List<String> studentGroups = repo.getAllStudentGroups(currentSemesterId, latestTimetableVersion);
        if (studentGroups != null) {
            return  studentGroups;
        } else {
            return new ArrayList<>();
        }
    }

    @Override
    public Long getLatestTimetableVersionInSemester(Long semId) {
        Optional<Long> version = repo.findLatestTimetableVersionInSemester(semId);
        return version.orElseGet(() -> 0L);
    }

    @Override
    public List<Timetable> getTimetableByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(Long profId, Long subjId, Long semId, String studentgroup, Long version) {
        return repo.findByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(profId, subjId, semId, studentgroup, version);
    }

    @Override
    public List<Timetable> getTimetableByProfessorIdAndRoomAndStudentgroupAndSemesterIdAndVersion(Long professorId, String room, String studentGroup, Long semesterId, Long version) {
        return repo.findByProfessorIdAndRoomAndStudentgroupAndSemesterIdAndVersion(professorId, room, studentGroup, semesterId, version);
    }

    @Override
    public List<Timetable> getTimetableBySubjectIdAndSemesterIdAndStudentgroupAndVersion(Long subjId, Long sessId, String studentgroup, Long version) {
        return repo.findBySubjectIdAndSemesterIdAndStudentgroupAndVersion(subjId,sessId,studentgroup,version);
    }

    @Override
    public Collection<Timetable> saveAll(Collection<Timetable> exams) {
        return repo.saveAll(exams);
    }

}
