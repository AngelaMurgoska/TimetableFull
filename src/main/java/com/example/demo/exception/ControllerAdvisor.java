package com.example.demo.exception;


import com.example.demo.exception.models.EmptyFileException;
import com.example.demo.exception.models.ExistingUserException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class ControllerAdvisor extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ExistingUserException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseEntity<Object> handleExistingUserException(ExistingUserException exception, WebRequest request) {
        String responseBody = "Веќе постои корисник со дадената e-mail адреса";
        return handleExceptionInternal(exception, responseBody,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(EmptyFileException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ResponseEntity<Object> handleEmptyFileException(EmptyFileException exception, WebRequest request) {
        String responseBody = "Ве молиме прикачете фајл кој не е празен";
        return handleExceptionInternal(exception, responseBody,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

}
