package com.example.timetable.exception.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "The student timetable parameter is empty")
public class EmptyStudentTimetableSelectionException extends RuntimeException {
}
