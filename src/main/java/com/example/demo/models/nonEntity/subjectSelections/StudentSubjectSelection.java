package com.example.demo.models.nonEntity.subjectSelections;

import lombok.Data;

@Data
public class StudentSubjectSelection {

    private Long subjectId;

    private Long professorId;

    private Long assistantId;

    private String group;

    public StudentSubjectSelection (){}

}
