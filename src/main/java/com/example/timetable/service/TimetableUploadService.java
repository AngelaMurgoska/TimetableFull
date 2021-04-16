package com.example.timetable.service;

import com.example.timetable.models.nonEntity.csv.TimetableUpload;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TimetableUploadService {

    void saveDataFromCsvFile( List<TimetableUpload> inputData);

    List<TimetableUpload> parseCsvFile(MultipartFile file);

}
