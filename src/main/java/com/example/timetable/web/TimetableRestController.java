package com.example.timetable.web;

import com.example.timetable.models.*;
import com.example.timetable.exception.models.EmptyFileException;
import com.example.timetable.exception.models.EmptyStudentTimetableSelectionException;
import com.example.timetable.exception.models.MissingRequestParametersException;
import com.example.timetable.models.nonEntity.csv.TimetableUpload;
import com.example.timetable.models.nonEntity.subjectSelections.StudentSubjectSelection;
import com.example.timetable.models.nonEntity.timetables.FilteredTimetable;
import com.example.timetable.models.nonEntity.timetables.StudentTimetable;
import com.example.timetable.service.*;
import com.example.timetable.service.calendar.GoogleCalendarService;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public Student getStudentInfoFromStudentindex(@PathVariable("index") String studentindex) {
        return studentService.getStudentByStudentindex(Long.parseLong(studentindex));
    }

    @GetMapping("studentemail/{email}")
    public Student getStudentInfoFromEmail(@PathVariable("email") String email) {
        return studentService.getStudentByEmail(email);
    }

    @GetMapping("{index}/currentSubjects")
    public boolean checkIfStudentHasSubjectsInCurrentSemester(@PathVariable("index") String studentIndex) {
        Semester currentSemester = semesterService.getLatestSemester();
        Student student = studentService.getStudentByStudentindex(Long.parseLong(studentIndex));
        return studentSubjectsService.getByStudentIdAndSemesterId(student.getId(), currentSemester.getId()).size() > 0;
    }

    @PostMapping("validate-subject-selection")
    public boolean validateSubjectSelection(@RequestParam Long professorId, @RequestParam Long subjectId, @RequestParam String studentGroup) {
        if (professorId == null || subjectId == null || studentGroup == null) {
            throw new MissingRequestParametersException();
        }
        Semester currentSemester = semesterService.getLatestSemester();
        Long latestVersionInCurrentSemester = timetableService.getLatestTimetableVersionInSemester(currentSemester.getId());
        List<Timetable> subjectSelection = timetableService.getTimetableByProfessorIdAndSubjectIdAndSemesterIdAndStudentgroupAndVersion(professorId, subjectId, currentSemester.getId(), studentGroup, latestVersionInCurrentSemester);
        return subjectSelection.size() > 0;
    }

    /*populating student's timetable according to their selection*/
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("create-timetable/{index}")
    public void createStudentTimetable(@PathVariable("index") String studentindex, @RequestBody List<StudentSubjectSelection> selectedTimetable) {
        if (selectedTimetable == null || selectedTimetable.size() == 0) {
            throw new EmptyStudentTimetableSelectionException();
        }
        studentSubjectsService.saveStudentSubjects(selectedTimetable, Long.parseLong(studentindex));
    }

    /*the timetable for a student that appears after the student logs in*/
    @PreAuthorize("hasAuthority('STUDENT')")
    @GetMapping("student/{index}/{day}")
    public List<StudentTimetable> getLoggedInStudentTimetableForDay(@PathVariable("index") String studentindex, @PathVariable("day") Long day) {
        Student student = studentService.getStudentByStudentindex(Long.parseLong(studentindex));
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
        List<FilteredTimetable> filteredTimetableList = filteredTimetableService.getFilteredTimetableListWithParameters(latestSemester, professorId, room, studentGroup);
        return filteredTimetableList.stream().filter(m -> m.getDay().equals(day)).collect(Collectors.toList());
    }

    //TODO think of the best solution (request param, path variable)
    /*dodavanje na event vo calendar*/
    @PreAuthorize("hasAuthority('STUDENT')")
    @PostMapping("add-to-calendar/{index}")
    public void addStudentTimetableToCalendar(@PathVariable("index") String studentindex) throws GeneralSecurityException, IOException {
        Student student = studentService.getStudentByStudentindex(Long.parseLong(studentindex));
        Semester latestSemester=semesterService.getLatestSemester();
        List<StudentSubjects> studentSubjects = studentSubjectsService.getByStudentIdAndSemesterId(student.getId(),latestSemester.getId());
        List<StudentTimetable> studentTimetable=studentTimetableService.getStudentTimetableLatestVersion(student,latestSemester,studentSubjects);
        googleCalendarService.addStudentTimetableToGoogleCalendar(studentTimetable);
    }

    /*upload na nov raspored*/
    @PreAuthorize("hasAuthority('STAFF')")
    @PostMapping("upload-timetable")
    public void uploadNewTimetableFile(@RequestParam("file") MultipartFile file, @RequestParam(required = false) String semesterType, @RequestParam(required = false) String academicYear, @RequestParam(required = false) String startDate, @RequestParam(required = false) String endDate) {
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

