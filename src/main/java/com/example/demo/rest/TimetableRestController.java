package com.example.demo.rest;

import com.example.demo.models.Professor;
import com.example.demo.models.Semester;
import com.example.demo.models.Student;
import com.example.demo.models.StudentSubjects;
import com.example.demo.models.exceptions.EmptyFileException;
import com.example.demo.models.exceptions.MissingParametersException;
import com.example.demo.models.nonEntity.csv.TimetableUpload;
import com.example.demo.models.nonEntity.timetables.FilteredTimetable;
import com.example.demo.models.nonEntity.timetables.StudentTimetable;
import com.example.demo.service.calendar.GoogleCalendarService;
import com.example.demo.service.impl.*;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/timetable/")
@CrossOrigin(origins = "http://localhost:3000")
public class TimetableRestController {

    private TimetableServiceImpl timetableService;
    private ProfessorServiceImpl professorService;
    private SemesterServiceImpl semesterService;
    private StudentServiceImpl studentService;
    private StudentSubjectsServiceImpl studentSubjectsService;
    private StudentTimetableServiceImpl studentTimetableService;
    private FilteredTimetableServiceImpl filteredTimetableService;
    private TimetableUploadServiceImpl timetableUploadService;
    private GoogleCalendarService googleCalendarService;

    public TimetableRestController(TimetableServiceImpl timetableService, ProfessorServiceImpl professorService, SemesterServiceImpl semesterService, StudentServiceImpl studentService, StudentSubjectsServiceImpl studentSubjectsService, StudentTimetableServiceImpl studentTimetableService,FilteredTimetableServiceImpl filteredTimetableService, TimetableUploadServiceImpl timetableUploadService, GoogleCalendarService googleCalendarService) {
        this.timetableService = timetableService;
        this.professorService = professorService;
        this.semesterService = semesterService;
        this.studentService = studentService;
        this.studentSubjectsService = studentSubjectsService;
        this.studentTimetableService=studentTimetableService;
        this.filteredTimetableService=filteredTimetableService;
        this.timetableUploadService=timetableUploadService;
        this.googleCalendarService = googleCalendarService;
    }

    @GetMapping("/professors")
    public List<Professor> getAllProfessors(){
        return professorService.getAllProfessors();
    }

    @GetMapping("/rooms")
    public List<String> getAllRooms(){
        return timetableService.getAllRooms();
    }

    @GetMapping("{index}")
    public Student getStudentInfo(@PathVariable("index") String studentindex) {
        return studentService.getByStuIndex(Long.parseLong(studentindex));
    }

    @GetMapping("studentemail/{email}")
    public Student getStudentAuthenticationInfo(@PathVariable("email") String email) {
        return studentService.getByStuEmail(email);
    }

    /*the timetable for a student that appears after the student logs in*/
    @GetMapping("student/{index}/{day}")
    public List<StudentTimetable> getCurrentStudentTimetable(@PathVariable("index") String studentindex, @PathVariable("day") Long day) {
        Student student = studentService.getByStuIndex(Long.parseLong(studentindex));
        Semester latestSemester=semesterService.getLatestSemester();
        List<StudentSubjects> studentSubjects = studentSubjectsService.getByStudentIdAndSemesterId(student.getId(),latestSemester.getId());
        List<StudentTimetable> studentTimetable=studentTimetableService.getStudentTimetableLatestVersion(student,latestSemester,studentSubjects);
        return studentTimetable.stream().filter(m -> m.getDay().equals(day)).collect(Collectors.toList());
    }

    /*timetable filtered by professor, room or both; no need to log in*/
    @GetMapping("filter/{day}")
    public List<FilteredTimetable> getFilteredTimetable(@PathVariable("day") Long day, @RequestParam(required = false) String professorId, @RequestParam(required = false) String room) {

        if (professorId == null && room == null) throw new MissingParametersException();

        Semester latestSemester = semesterService.getLatestSemester();
        List<FilteredTimetable> filteredTimetableList = new ArrayList<>();

        if (professorId != null && room != null) {
            filteredTimetableList = filteredTimetableService.getFilteredTimetableByProfessorAndRoomLatestVersion(latestSemester, Long.parseLong(professorId), room);
        } else if (professorId != null) {
            filteredTimetableList = filteredTimetableService.getFilteredTimetableByProfessorLatestVersion(latestSemester, Long.parseLong(professorId));
        } else {
            filteredTimetableList = filteredTimetableService.getFilteredTimetableByRoomLatestVersion(latestSemester, room);
        }
        return filteredTimetableList.stream().filter(m -> m.getDay().equals(day)).collect(Collectors.toList());
    }

    //TODO think of the best solution (request param, path variable)
    /*dodavanje na event vo calendar*/
    @PostMapping("add-to-calendar/{index}")
    public void addStudentTimetableToCalendar(@PathVariable("index") String studentindex) throws GeneralSecurityException, IOException {
        Student student = studentService.getByStuIndex(Long.parseLong(studentindex));
        Semester latestSemester=semesterService.getLatestSemester();
        List<StudentSubjects> studentSubjects = studentSubjectsService.getByStudentIdAndSemesterId(student.getId(),latestSemester.getId());
        List<StudentTimetable> studentTimetable=studentTimetableService.getStudentTimetableLatestVersion(student,latestSemester,studentSubjects);
        googleCalendarService.addStudentTimetableToGoogleCalendar(studentTimetable);
    }

    /*upload na nov raspored*/
    @PostMapping("upload-timetable")
    public void uploadCSVFile(@RequestParam("file") MultipartFile file,@RequestParam(required = false) String semesterType,@RequestParam(required = false) String academicYear) {
        if (file.isEmpty()) {
            throw new EmptyFileException();
        } else {
                List<TimetableUpload> inputData = timetableUploadService.parseCsvFile(file);
                if (inputData != null) {
                    //ako se dodava nov semestar, tuka se kreira
                    if(semesterType!=null && academicYear!=null){
                        semesterService.createNewSemester(Long.parseLong(semesterType),academicYear);
                    }
                    timetableUploadService.saveDataFromCsvFile(inputData);
                }
        }
    }
}

