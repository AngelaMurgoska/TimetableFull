package com.example.timetable.exception.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "You have not provided the suitable parameters")
public class MissingRequestParametersException extends RuntimeException{
}
