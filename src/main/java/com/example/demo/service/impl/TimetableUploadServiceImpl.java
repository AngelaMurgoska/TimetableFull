package com.example.demo.service.impl;

import com.example.demo.models.Professor;
import com.example.demo.models.Semester;
import com.example.demo.models.Subject;
import com.example.demo.models.Timetable;
import com.example.demo.models.nonEntity.csv.TimetableUpload;
import com.example.demo.service.*;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;

@Service
public class TimetableUploadServiceImpl implements TimetableUploadService {

    private ProfessorService professorService;

    private SubjectService subjectService;

    private SemesterService semesterService;

    private TimetableService timetableService;

    public TimetableUploadServiceImpl(ProfessorService professorService, SubjectService subjectService, SemesterService semesterService, TimetableService timetableService) {
        this.professorService = professorService;
        this.subjectService = subjectService;
        this.semesterService = semesterService;
        this.timetableService = timetableService;
    }

    //dodavanje na nova verzija na raspored vo posledno dodadeniot semestar
    @Override
    public void saveDataFromCsvFile(List<TimetableUpload> inputData) {
        Map<String, Timetable> timetables = new HashMap<>();
        Semester semester = semesterService.getLatestSemester();
        Long latestVersionInSemester = timetableService.getLatestTimetableVersionInSemester(semester.getId());

        //timetableUpload = eden red od csv fajlot
        for (TimetableUpload timetableUpload : inputData) {
            //odreduvanje na modul
            String studentGroup = timetableUpload.getModule();
            String identifier = timetableUpload.getProfessor() + " " + timetableUpload.getSubject() + " " + timetableUpload.getRoom() + " " + studentGroup + " " + timetableUpload.getDay();

            if (!timetables.containsKey(identifier)) {

                //vnesuvanje na profesori i asistenti
                Professor professor = professorService.getProfessorByName(timetableUpload.getProfessor());
                if(professor == null) {
                    professorService.saveProfessor(timetableUpload.getProfessor());
                    professor = professorService.getProfessorByName(timetableUpload.getProfessor());
                }

                Subject subject = subjectService.getByName(timetableUpload.getSubject());
                if (subject == null) {
                    subjectService.saveSubject(timetableUpload.getSubject());
                    subject = subjectService.getByName(timetableUpload.getSubject());
                }

                Timetable newTimetable = new Timetable(8 + Long.parseLong(timetableUpload.getHourFrom()),
                        9 + Long.parseLong(timetableUpload.getHourFrom()), Long.parseLong(timetableUpload.getDay()), timetableUpload.getRoom(),
                        studentGroup, professor, subject, semester, latestVersionInSemester + 1);
                timetables.put(identifier, newTimetable);
            } else {
                Timetable existingTimetable = timetables.get(identifier);
                existingTimetable.setHourTo(existingTimetable.getHourTo() + 1);
                timetables.replace(identifier, existingTimetable);
            }
            timetableService.saveAll(timetables.values());
        }
    }

    @Override
    public List<TimetableUpload> parseCsvFile(MultipartFile file) {
        // parse CSV file to create a list of `TimetableUpload` objects
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            // create csv bean reader
            CsvToBean<TimetableUpload> csvToBean = new CsvToBeanBuilder(reader)
                    .withType(TimetableUpload.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            return csvToBean.parse();
        } catch (IOException e) {
            System.err.println("Something went wrong while parsing the csv file");
            return null;
        }
    }

}
