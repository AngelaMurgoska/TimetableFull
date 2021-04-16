package com.example.timetable.exception.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "The provided role doesn't exist")
public class NonExistentRoleException extends RuntimeException{
}
