package com.example.demo.service;

import com.example.demo.models.nonEntity.csv.TimetableUpload;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TimetableUploadService {

    void saveDataFromCsvFile( List<TimetableUpload> inputData);

    List<TimetableUpload> parseCsvFile(MultipartFile file);

}
