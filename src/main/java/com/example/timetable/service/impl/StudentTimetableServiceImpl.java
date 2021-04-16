package com.example.timetable.service.impl;

import com.example.timetable.models.Semester;
import com.example.timetable.models.Student;
import com.example.timetable.models.StudentSubjects;
import com.example.timetable.models.Timetable;
import com.example.timetable.models.nonEntity.timetables.StudentTimetable;
import com.example.timetable.service.StudentTimetableService;
import com.example.timetable.service.TimetableService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class StudentTimetableServiceImpl implements StudentTimetableService {

    private TimetableService timetableService;

    public StudentTimetableServiceImpl(TimetableService timetableService){
        this.timetableService=timetableService;
    }

    //raboti nezavisno od semestar, dava latest verzija na raspored za student od bilo koj semestar
    @Override
    public List<StudentTimetable> getStudentTimetableLatestVersion(Student student, Semester semester, List<StudentSubjects> studentSubjects) {
        List<StudentTimetable> studentTimetableList = new ArrayList<>();;
        Long lastTimetableVersion=timetableService.getLatestTimetableVersionInSemester(semester.getId());

        for (StudentSubjects s : studentSubjects) {
            List<Timetable> timetables = timetableService.getTimetableByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(s.getProfessor().getId(),s.getSubject().getId(),semester.getId(),s.getStudentGroupTimetable(),lastTimetableVersion);
            for (Timetable timetable : timetables) {
                String hourFrom = timetable.getHourFromInDoubleDigitFormatWithMinutes();
                String hourTo = timetable.getHourToInDoubleDigitFormatWithMinutes();
                StudentTimetable studentTimetable = new StudentTimetable(student.getName(), student.getSurname(), student.getStudentindex(), s.getSubject().getName(), timetable.getProfessor().getName(),
                        s.getStudentGroupTimetable(), timetable.getRoom(), hourFrom, hourTo, timetable.getDay());
                if (!studentTimetableList.contains(studentTimetable)) {
                    studentTimetableList.add(studentTimetable);
                }
            }
        }

        return studentTimetableList;
    }

}
