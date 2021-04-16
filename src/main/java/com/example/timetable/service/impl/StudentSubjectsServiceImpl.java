package com.example.timetable.service.impl;

import com.example.timetable.models.*;
import com.example.timetable.models.nonEntity.subjectSelections.StudentSubjectSelection;
import com.example.timetable.repository.JpaStudentSubjectsRepository;
import com.example.timetable.service.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentSubjectsServiceImpl implements StudentSubjectsService {

    private JpaStudentSubjectsRepository repo;

    private TimetableService timetableService;

    private SemesterService semesterService;

    private ProfessorService professorService;

    private SubjectService subjectService;

    private StudentService studentService;

    public StudentSubjectsServiceImpl(JpaStudentSubjectsRepository repo, TimetableService timetableService, SemesterService semesterService, ProfessorService professorService, SubjectService subjectService, StudentService studentService) {
        this.repo = repo;
        this.timetableService = timetableService;
        this.semesterService = semesterService;
        this.professorService = professorService;
        this.subjectService = subjectService;
        this.studentService = studentService;
    }

    @Override
    public List<StudentSubjects> getByStudentId(Long stuId) {
        return repo.findByStudentId(stuId);
    }

    @Override
    public List<StudentSubjects> getByStudentIdAndSemesterId(Long stuId, Long semId) {
        return repo.findByStudentIdAndSemesterId(stuId,semId);
    }

    //TODO validation
    @Override
    public void saveStudentSubjects(List<StudentSubjectSelection> subjectSelections, Long studentindex) {
        Student student = studentService.getStudentByStudentindex(studentindex);
        Semester latestSemester = semesterService.getLatestSemester();
        Long latestTimetableVersionInCurrentSemester = timetableService.getLatestTimetableVersionInSemester(latestSemester.getId());
        for (StudentSubjectSelection singleSelection : subjectSelections) {
            if (singleSelection.getProfessorId() != null) {
                saveStudentSubject(singleSelection.getProfessorId(), singleSelection.getSubjectId(), singleSelection.getGroup(), student, latestSemester, latestTimetableVersionInCurrentSemester);
            }
            if (singleSelection.getAssistantId() != null) {
                saveStudentSubject(singleSelection.getAssistantId(), singleSelection.getSubjectId(), singleSelection.getGroup(), student, latestSemester, latestTimetableVersionInCurrentSemester);
            }
        }
    }

    private void saveStudentSubject(Long professorId, Long subjectId, String studentGroup, Student student, Semester latestSemester, Long latestTimetableVersionInCurrentSemester) {
        if (timetableService.getTimetableByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(professorId,subjectId,latestSemester.getId(), studentGroup, latestTimetableVersionInCurrentSemester) != null) {
            StudentSubjects studentSubject = new StudentSubjects();
            Professor professor = professorService.getProfessorById(professorId).get();
            Subject subject = subjectService.getSubjectById(subjectId).get();
            studentSubject.setStudent(student);
            studentSubject.setProfessor(professor);
            studentSubject.setSubject(subject);
            studentSubject.setSemester(latestSemester);
            studentSubject.setStudentGroupTimetable(studentGroup);
            repo.save(studentSubject);
        }
    }

}
