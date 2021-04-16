package com.example.timetable.exception.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

//Empty file exception, thrown when an empty file is uploaded to the system
@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "The uploaded file is empty")
public class EmptyFileException extends RuntimeException{
}
