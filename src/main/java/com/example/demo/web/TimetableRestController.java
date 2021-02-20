package com.example.demo.web;

import com.example.demo.models.*;
import com.example.demo.models.exceptions.EmptyFileException;
import com.example.demo.models.exceptions.EmptyStudentTimetableException;
import com.example.demo.models.exceptions.ExistingUserException;
import com.example.demo.models.exceptions.MissingRequestParametersException;
import com.example.demo.models.nonEntity.csv.TimetableUpload;
import com.example.demo.models.nonEntity.subjectSelections.StudentSubjectSelection;
import com.example.demo.models.nonEntity.timetables.FilteredTimetable;
import com.example.demo.models.nonEntity.timetables.StudentTimetable;
import com.example.demo.service.*;
import com.example.demo.service.calendar.GoogleCalendarService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/timetable/")
@CrossOrigin(origins = "http://localhost:3000")
public class TimetableRestController {

    private TimetableService timetableService;
    private SubjectService subjectService;
    private ProfessorService professorService;
    private SemesterService semesterService;
    private StudentService studentService;
    private StudentSubjectsService studentSubjectsService;
    private StudentTimetableService studentTimetableService;
    private FilteredTimetableService filteredTimetableService;
    private TimetableUploadService timetableUploadService;
    private GoogleCalendarService googleCalendarService;

    public TimetableRestController(TimetableService timetableService, SubjectService subjectService, ProfessorService professorService, SemesterService semesterService, StudentService studentService, StudentSubjectsService studentSubjectsService, StudentTimetableService studentTimetableService,FilteredTimetableService filteredTimetableService, TimetableUploadService timetableUploadService, GoogleCalendarService googleCalendarService) {
        this.timetableService = timetableService;
        this.subjectService = subjectService;
        this.professorService = professorService;
        this.semesterService = semesterService;
        this.studentService = studentService;
        this.studentSubjectsService = studentSubjectsService;
        this.studentTimetableService=studentTimetableService;
        this.filteredTimetableService=filteredTimetableService;
        this.timetableUploadService=timetableUploadService;
        this.googleCalendarService = googleCalendarService;
    }

    @GetMapping("/subjects")
    public List<Subject> getAllSubjects(){ return subjectService.getAllSubjects();
    }

    @GetMapping("/professors")
    public List<Professor> getAllProfessors(){
        return professorService.getAllProfessors();
    }

    @GetMapping("/rooms")
    public List<String> getAllRooms(){
        return timetableService.getAllRooms();
    }

    @GetMapping("/studentgroups")
    public List<String> getAllCurrentStudentGroups(){
        return timetableService.getAllCurrentStudentGroups();
    }

    @GetMapping("/latestSemester")
    public Semester getCurrentSemester() {
        return semesterService.getLatestSemester();
    }

    @GetMapping("{index}")
    public Student getStudentInfo(@PathVariable("index") String studentindex) {
        return studentService.getByStuIndex(Long.parseLong(studentindex));
    }

    @GetMapping("{index}/currentSubjects")
    public boolean checkIfStudentHasSubjectsInCurrentSemester(@PathVariable("index") String studentIndex) {
        Semester currentSemester = semesterService.getLatestSemester();
        Student student = studentService.getByStuIndex(Long.parseLong(studentIndex));
        return studentSubjectsService.getByStudentIdAndSemesterId(student.getId(), currentSemester.getId()).size() > 0;
    }

    @GetMapping("studentemail/{email}")
    public Student getStudentAuthenticationInfo(@PathVariable("email") String email) {
        return studentService.getByStuEmail(email);
    }

    @PostMapping("check-subject-selection")
    public boolean checkSubjectSelection(@RequestParam Long professorId, @RequestParam Long subjectId, @RequestParam String studentGroup) {
        if (professorId == null || subjectId == null || studentGroup == null) {
            throw new MissingRequestParametersException();
        }
        Semester currentSemester = semesterService.getLatestSemester();
        Long latestVersionInCurrentSemester = timetableService.getLatestTimetableVersionInSemester(currentSemester.getId());
        List<Timetable> subjectSelection = timetableService.getByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(professorId, subjectId, currentSemester.getId(), studentGroup, latestVersionInCurrentSemester);
        return subjectSelection.size() > 0;
    }

    /*populating student's timetable according to their selection*/
    @PostMapping("create-timetable/{index}")
    public void createStudentTimetable(@PathVariable("index") String studentindex, @RequestBody List<StudentSubjectSelection> selectedTimetable) {
        if (selectedTimetable == null) {
            throw new EmptyStudentTimetableException();
        }
        studentSubjectsService.saveStudentSubjects(selectedTimetable, Long.parseLong(studentindex));
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

    /*timetable filtered by professor, room, group; no need to log in*/
    @GetMapping("filter/{day}")
    public List<FilteredTimetable> getFilteredTimetable(@PathVariable("day") Long day, @RequestParam(required = false) String professorId, @RequestParam(required = false) String room, @RequestParam(required = false) String studentGroup) {
        if (professorId == null && room == null && studentGroup == null){
            throw new MissingRequestParametersException();
        }
        Semester latestSemester = semesterService.getLatestSemester();
        List<FilteredTimetable> filteredTimetableList = filteredTimetableService.getFilteredTimetableWithParameters(latestSemester, professorId, room, studentGroup);
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
    public void uploadCSVFile(@RequestParam("file") MultipartFile file,@RequestParam(required = false) String semesterType,@RequestParam(required = false) String academicYear, @RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate) {
        if (file.isEmpty()) {
            throw new EmptyFileException();
        } else {
                List<TimetableUpload> inputData = timetableUploadService.parseCsvFile(file);
                if (inputData != null) {
                    if(semesterType!=null && academicYear!=null && startDate != null && endDate != null){
                        LocalDate startDateLocalDate = LocalDate.parse(startDate);
                        LocalDate endDateLocalDate = LocalDate.parse(endDate);
                        semesterService.createNewSemester(Long.parseLong(semesterType),academicYear, startDateLocalDate, endDateLocalDate);
                    }
                    timetableUploadService.saveDataFromCsvFile(inputData);
                }
        }
    }
}

